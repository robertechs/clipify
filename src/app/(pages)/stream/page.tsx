'use client';

export const dynamic = 'force-dynamic';

import styles from "./page.module.css";
import { useState, useRef, useEffect, Suspense } from "react";
import { toast } from 'sonner';
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header/Header";


function StreamContent() {
	const searchParams = useSearchParams();
	const url = searchParams.get("url");

	const [inputUrl, setInputUrl] = useState("");
	const [clips, setClips] = useState<{ url: string; name: string, thumbnail: string }[]>([]);
	const [ffmpeg, setFfmpeg] = useState<any>(null);
	const [isFfmpegLoaded, setIsFfmpegLoaded] = useState(false);
	const [showCapModal, setShowCapModal] = useState(false);
	const [showNotifyForm, setShowNotifyForm] = useState(false);
	const [notifyEmail, setNotifyEmail] = useState("");
	const [notifySubmitted, setNotifySubmitted] = useState(false);
	const [notifyLoading, setNotifyLoading] = useState(false);

	const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
	};

	const handleNotifySubmit = () => {
		if (!isValidEmail(notifyEmail)) return;
		setNotifyLoading(true);
		setTimeout(() => {
			setNotifyLoading(false);
			setNotifySubmitted(true);
		}, 3000);
	};

	const isValidPumpUrl = (url: string) => {
		const trimmed = url.trim();
		return trimmed.startsWith("https://pump.fun/") || trimmed.startsWith("http://pump.fun/") || trimmed.startsWith("pump.fun/");
	};

	useEffect(() => {
		if (url && ffmpeg) {
			load(url);
		}
	}, [url, ffmpeg]);

	// ... existing code ...
	// Initialize FFmpeg only on client side
	useEffect(() => {
		async function initFfmpeg() {
			try {
				const { FFmpeg } = await import("@ffmpeg/ffmpeg");
				const ffmpegInstance = new FFmpeg();
				setFfmpeg(ffmpegInstance);
			} catch (error) {
				console.error("Failed to load FFmpeg:", error);
			}
		}
		
		initFfmpeg();
	}, []);

	// Step 1: Convert Pump URL
	function convertPumpUrl(inputUrl: string): string | null {
		try {
			const url = new URL(inputUrl);
			const pathParts = url.pathname.split('/');
			const coinId = pathParts[pathParts.length - 1];
			const clipParam = url.searchParams.get('clip');
			if(!clipParam) {
				return `https://clips.pump.fun/${pathParts[pathParts.length - 2]}/clips/${ pathParts[pathParts.length - 1]}/playlist.m3u8`;
			}
			if (!clipParam) return null;
			const clipDecoded = decodeURIComponent(clipParam);
			return `https://clips.pump.fun/${coinId}/clips/${clipDecoded}/playlist.m3u8`;
		} catch {
			return null;
		}
	}
	async function load(url: string) {
		if (!ffmpeg) {
			toast.error("Not loaded yet");
			return;
		}
		const res = convertPumpUrl(url);
		console.log(res);
		if (res) await loadStream(res);
	}

	// Step 2: Load & merge stream
	async function loadStream(playlistUrl: string) {
		if (!ffmpeg) return;

		const toastId = toast.loading("Loading...");
		
		if (!isFfmpegLoaded) {
			await ffmpeg.load();
			setIsFfmpegLoaded(true);
		}

		toast.loading("Fetching playlist...", { id: toastId });
		const playlistText = await fetch(`/api/fetch-playlist?url=${encodeURIComponent(playlistUrl)}`).then(r => r.text());
		const segmentUrls = playlistText
			.split("\n")
			.filter(line => line && !line.startsWith("#"))
			.map(url =>
				url.startsWith("http") ? url : new URL(url, playlistUrl).toString()
			);

		if(segmentUrls.length >= 320) return toast.error('Streams longer than 10 minutes are available only to premium users', { id: toastId });

		toast.loading("Downloading segments...", { id: toastId });
		
		// Use API endpoint to download segments
		const downloadResponse = await fetch('/api/download-segments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ playlistUrl })
		});

		if (!downloadResponse.ok) {
			throw new Error('Failed to download segments');
		}

		const { data: base64Data, segmentCount } = await downloadResponse.json();
		const combined = new Uint8Array(Buffer.from(base64Data, 'base64'));
		
		toast.loading(`Downloaded ${segmentCount} segments`, { id: toastId });

		await ffmpeg.writeFile("input.ts", combined);
		toast.loading("Converting to MP4...", { id: toastId });
		await ffmpeg.exec(["-i", "input.ts", "-c", "copy", "output.mp4"]);

		toast.loading("Extracting audio...", { id: toastId });
		await ffmpeg.exec(["-i", "output.mp4", "-vn", "-ar", "16000", "-ac", "1", "-f", "wav", "audio.wav"]);
		const audioData = await ffmpeg.readFile("audio.wav");

		// Step 3: Run VAD
		toast.loading("Running Voice Activity Detection...", { id: toastId });
		// @ts-ignore
		const vadSegments = await detectSpeechSegments(audioData.buffer);


		// Step 4: Use merged VAD segments directly
		const clipIntervals: [number, number][] = vadSegments;

		if(clipIntervals.length == 0) return toast.error('No clips segments found', { id: toastId });

		// Step 5: Cut clips with FFmpeg
		toast.loading(`Cutting ${clipIntervals.length} clips...`, { id: toastId });


		const resultClips: { url: string; name: string, thumbnail: string }[] = [];
		for (let i = 0; i < clipIntervals.length; i++) {
			const [start, end] = clipIntervals[i];
			const outName = `clip_${i}.mp4`;

			// cut clip
			await ffmpeg.exec([
				"-i", "output.mp4",
				"-ss", start.toString(),
				"-to", end.toString(),
				"-c", "copy",
				outName
			]);

			// extract first frame BEFORE deleting outName
			const frameName = `thumb_${i}.png`;
			await ffmpeg.exec([
				"-i", outName,
				"-frames:v", "1",
				frameName
			]);

			// read video blob
			const data = await ffmpeg.readFile(outName);
			// @ts-ignore
			const uint8Data = new Uint8Array(data); // force proper backing ArrayBuffer
			const blob = new Blob([uint8Data.buffer], { type: "video/mp4" });
			const url = URL.createObjectURL(blob);

			// read thumbnail blob
			const thumbData = await ffmpeg.readFile(frameName);
			// @ts-ignore
			const thumbUint8 = new Uint8Array(thumbData); // ensure proper ArrayBuffer
			const thumbBlob = new Blob([thumbUint8.buffer], { type: "image/png" });
			const thumbUrl = URL.createObjectURL(thumbBlob);

			// cleanup AFTER reads
			await ffmpeg.deleteFile(outName);
			await ffmpeg.deleteFile(frameName);

			resultClips.push({ url, name: outName, thumbnail: thumbUrl });
		}

		setClips(resultClips);
		setLoadedClip(resultClips[0].url);
		toast.success("Done!", { id: toastId });
	}

	// Voice Activity Detection helper
	async function detectSpeechSegments(arrayBuffer: ArrayBuffer): Promise<[number, number][]> {
		const audioCtx = new AudioContext({ sampleRate: 16000 });
		const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
		const channel = audioBuffer.getChannelData(0);

		const frameSize = Math.floor(audioBuffer.sampleRate * 0.03); // 30ms frames
		const threshold = 0.02;  // adjust as needed
		const minSilence = 1.5;  // merge pauses < 1.5s
		const minClip = 3;       // discard clips < 3s

		let segments: [number, number][] = [];
		let inSpeech = false;
		let segStart = 0;
		let lastSpeechTime = 0;

		for (let i = 0; i < channel.length; i += frameSize) {
			const frame = channel.slice(i, i + frameSize);
			const rms = Math.sqrt(frame.reduce((s, x) => s + x * x, 0) / frame.length);
			const time = i / audioBuffer.sampleRate;

			if (rms > threshold) {
				if (!inSpeech) {
					segStart = time;
					inSpeech = true;
				}
				lastSpeechTime = time;
			} else if (inSpeech && time - lastSpeechTime > minSilence) {
				if (lastSpeechTime - segStart >= minClip) {
					segments.push([segStart, lastSpeechTime]);
				}
				inSpeech = false;
			}
		}

		if (inSpeech && channel.length / audioBuffer.sampleRate - segStart >= minClip) {
			segments.push([segStart, channel.length / audioBuffer.sampleRate]);
		}

		return segments;
	}

	const [loadedClip, setLoadedClip] = useState<string | null>(null);
	const [croppedClip, setCroppedClip] = useState<string | null>(null);
	const [cropRatio, setCropRatio] = useState<string | null>("16:9");

	const [isCropping, setIsCropping] = useState(false);

	async function cropLoadedClip(ratio: string, url?: string) {
		if (!url) url = loadedClip || "";
		if (!url) return;
		if (!ffmpeg) {
			toast.error("FFmpeg not loaded yet");
			return;
		}

		setIsCropping(true);

		const toastId = toast.loading("Cropping video...");

		try {
			// Ensure FFmpeg is loaded
			if (!isFfmpegLoaded) {
				await ffmpeg.load();
				setIsFfmpegLoaded(true);
			}

			// Convert blob URL to file data
			const response = await fetch(url);
			const videoData = await response.arrayBuffer();

			await ffmpeg.writeFile("input_video.mp4", new Uint8Array(videoData));

			// Calculate crop dimensions based on ratio
			let cropFilter;
			if (ratio === '9:16') {
				cropFilter = "crop=ih*9/16:ih"; // Crop to 9:16 aspect ratio
			} else if (ratio === '16:9') {
				cropFilter = "crop=iw:iw*9/16"; // Crop to 16:9 aspect ratio
			} else if (ratio === '1:1') {
				cropFilter = "crop=ih:ih"; // Crop to square (1:1)
			} else {
				cropFilter = "crop=ih:ih"; // Default to square
			}

			// Execute crop command
			const command = [
				"-i", "input_video.mp4",
				"-vf", cropFilter,
				"-c:v", "libx264",
				"-c:a", "aac",
				"-b:a", "128k",
				"-preset", "ultrafast",
				"-crf", "18",
				"-pix_fmt", "yuv420p",
				"-movflags", "+faststart",
				"cropped_output.mp4"
			];

			await ffmpeg.exec(command);

			// Read the output file
			const outputData = await ffmpeg.readFile("cropped_output.mp4"); // Uint8Array<ArrayBufferLike>
			// @ts-ignore
			const fixedData = new Uint8Array(outputData);      // Ensures proper backing ArrayBuffer
			const newBlob = new Blob([fixedData.buffer], { type: "video/mp4" });

			const newUrl = URL.createObjectURL(newBlob);

			// Update the loaded clip
			setCroppedClip(newUrl);
			setCropRatio(ratio);
			toast.success("Crop completed!", { id: toastId });

			// Clean up files
			await ffmpeg.deleteFile("input_video.mp4");
			await ffmpeg.deleteFile("cropped_output.mp4");

		} catch (error) {
			console.error("Crop error:", error);
			toast.error("Crop failed!", { id: toastId });
			setCroppedClip("16:9");
		} finally {
			setIsCropping(false);
		}
	}

	function loadClip(url: string) {
		setLoadedClip(url);
		setCroppedClip(url);
		if (cropRatio != "16:9") {
			cropLoadedClip(cropRatio || "16:9", url);
		}
	}

	function download() {
		const a = document.createElement("a");
		const url = croppedClip || loadedClip;
		if (!url) return;
		a.href = url;
		a.download = "output.mp4";
		document.body.appendChild(a);
		a.click();
		a.remove();
	}

	const videoRef = useRef<HTMLVideoElement>(null);

	return (
		<>
		<Header />
		<div className={styles.page}>
			<div className={styles.content}>

			<div className={styles.input}>
				<Image src="/pumpfun.png" alt="pumpfun" width={20} height={20} />
				<input type="text" placeholder="Enter a Pump.fun stream link" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} />
				<button
					disabled={!isValidPumpUrl(inputUrl)}
					onClick={() => setShowCapModal(true)}
					className={!isValidPumpUrl(inputUrl) ? styles.disabled : ''}
				>
					{clips.length > 0 ? "Try another" : "Clip it"}
				</button>
			</div>

			{showCapModal && (
				<div className={styles.modalOverlay} onClick={() => { setShowCapModal(false); setShowNotifyForm(false); setNotifySubmitted(false); }}>
					<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
						<div className={styles.modalIcon}>
							<Image src="/logo.png" alt="Clipify" width={40} height={40} />
						</div>

						{!showNotifyForm && !notifySubmitted && (
							<>
								<h3>clip limit reached</h3>
								<p>the hourly cap of 10 clips has been reached.<br/>try again in a bit.</p>
								<div className={styles.modalActions}>
									<button onClick={() => setShowCapModal(false)}>got it</button>
									<button className={styles.notifyBtn} onClick={() => setShowNotifyForm(true)}>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M21 19V20H3V19L5 17V11C5 7.9 7.03 5.17 10 4.29V4C10 3.46957 10.2107 2.96086 10.5858 2.58579C10.9609 2.21071 11.4696 2 12 2C12.5304 2 13.0391 2.21071 13.4142 2.58579C13.7893 2.96086 14 3.46957 14 4V4.29C16.97 5.17 19 7.9 19 11V17L21 19ZM14 21C14 21.5304 13.7893 22.0391 13.4142 22.4142C13.0391 22.7893 12.5304 23 12 23C11.4696 23 10.9609 22.7893 10.5858 22.4142C10.2107 22.0391 10 21.5304 10 21" fill="#2AD986"/>
										</svg> notify me
									</button>
								</div>
							</>
						)}

						{showNotifyForm && !notifySubmitted && !notifyLoading && (
							<>
								<h3>get notified</h3>
								<p>drop your email and we'll let you know<br/>when clips are available again.</p>
								<div className={styles.emailForm}>
									<input
										type="email"
										placeholder="your@email.com"
										value={notifyEmail}
										onChange={(e) => setNotifyEmail(e.target.value)}
										className={styles.emailInput}
									/>
									<button
										onClick={handleNotifySubmit}
										disabled={!isValidEmail(notifyEmail)}
									>
										submit
									</button>
								</div>
							</>
						)}

						{notifyLoading && (
							<>
								<h3>submitting...</h3>
								<div className={styles.loader}></div>
							</>
						)}

						{notifySubmitted && !notifyLoading && (
							<>
								<h3>you're in</h3>
								<p>we got it. we'll notify you as soon as<br/>new clips are ready to go.</p>
								<button onClick={() => { setShowCapModal(false); setShowNotifyForm(false); setNotifySubmitted(false); }}>done</button>
							</>
						)}
					</div>
				</div>
			)}
				<div className={styles.editor}>
					<div className={styles.selectedVideo}>
						{
							!loadedClip &&
							<div className={styles.loading}>
								<Image src="/clip.png" alt="loading" width={1920} height={1080} className={styles.loadingImage}/>
							</div>
						}
						{
							loadedClip &&
							<video src={croppedClip || loadedClip} controls={true} autoPlay={false} loop={false} ref={videoRef}>
							</video>
						}
					</div>
				<div className={styles.settings}>
					<div className={styles.crop}>
						<button onClick={() => { setCropRatio('9:16'); if (loadedClip) cropLoadedClip('9:16'); }} className={cropRatio == '9:16' ? styles.selected : ''}>
							<div className={styles.ratio} /><span>9:16</span>
						</button>
						<button onClick={() => { setCropRatio('16:9'); if (loadedClip) cropLoadedClip('16:9'); }} className={cropRatio == '16:9' ? styles.selected : ''}>
							<div className={styles.ratio} /><span>16:9</span>
						</button>
						<button onClick={() => { setCropRatio('1:1'); if (loadedClip) cropLoadedClip('1:1'); }} className={cropRatio == '1:1' ? styles.selected : ''}>
							<div className={styles.ratio} /><span>1:1</span>
						</button>
					</div>
				</div>

				</div>
			</div>

			{clips.length > 0 && (
				<div className={styles.videoPreview}>
					<div className={styles.clips}>
						{clips.map((c, i) => (
							<div key={i} className={`${loadedClip == c.url ? styles.selected : ''} ${styles.videoContainer}`} onClick={() => loadClip(c.url)} >
								<img src={c.thumbnail} alt={c.name} width={192} height={108} className={styles.thumbnail} />
							</div>
						))}
					</div>
				</div>
			)}

		</div>
		</>
	);
}

export default function Home() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<StreamContent />
		</Suspense>
	);
}