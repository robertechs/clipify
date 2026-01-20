// app/api/transcribe/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json(
				{ error: "No file provided" },
				{ status: 400 }
			);
		}

		// Validate file type
		if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
			return NextResponse.json(
				{ error: "File must be a video or audio file" },
				{ status: 400 }
			);
		}

		// Validate file size (max 25MB for OpenAI API)
		const maxSize = 25 * 1024 * 1024; // 25MB
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: "File size must be less than 25MB" },
				{ status: 400 }
			);
		}

		const transcription = await openai.audio.transcriptions.create({
			file: file,
			model: "whisper-1",
			response_format: "srt", // 👈 this gives subtitle timestamps
		});

		return NextResponse.json({ srt: transcription });
	} catch (error) {
		console.error("Transcription error:", error);
		
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message },
				{ status: 500 }
			);
		}
		
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
