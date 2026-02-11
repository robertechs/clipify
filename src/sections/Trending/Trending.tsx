import styles from "./Trending.module.css";
import { HiFire } from "react-icons/hi";
import Image from "next/image";
import { FaCommentAlt } from "react-icons/fa";
import Link from "next/link";
import { app } from "@/sections/Hero/Hero";

export default function Trending() {
	return (
		<div className={styles.main}>
			<div className={styles.title}>
				<HiFire className={styles.icon} />
				<h1>Trending Now</h1>
				<p>From link to viral-ready clip in just three steps.<br/>No editing, no wasted time just highlights.</p>
			</div>

			<div className={styles.clips}>

				<Link href="https://x.com/c3ntilmen/status/1967141971711193122" target="_blank">
				{/* 	<Image src="/clip/1.png" alt="Clip" width={428} height={652} /> */}
					<video src="/clip/1.mp4" autoPlay muted loop playsInline poster="/clip/1.png" />
					<p>
						<FaCommentAlt />
						<span>DAAMN</span>
					</p>
				</Link>
				<Link href="hhttps://x.com/pumpfun_tv/status/1966406539163344973" target="_blank">
				<video src="/clip/2.mp4" autoPlay muted loop playsInline poster="/clip/2.png" />
					<p>
						<FaCommentAlt />
						<span>WTFFFF</span>
					</p>
				</Link>
				<Link href="https://x.com/yoxics/status/1966240543819858356" target="_blank">
				<video src="/clip/3.mp4" autoPlay muted loop playsInline poster="/clip/3.png" />
					<p>
						<FaCommentAlt />
						<span>BIG W</span>
					</p>
				</Link>
				<Link href="https://x.com/gainzy222/status/1966762539053695034" target="_blank">
				<video src="/clip/4.mp4" autoPlay muted loop playsInline poster="/clip/4.png" />
					<p>
						<FaCommentAlt />
						<span>That&apos;s Crazyy</span>
					</p>
				</Link>

				<Link href={app} className={styles.button}>
					<p>+</p>
					<p>Try Clipify now!</p>
				</Link>


				<Link href="https://x.com/c3ntilmen/status/1967141971711193122" className={styles.hidden}>
				<video src="/clip/1.mp4" autoPlay muted loop playsInline poster="/clip/1.png" />
					<p>
						<FaCommentAlt />
						<span>DAAMN</span>
					</p>
				</Link>
				<Link href="hhttps://x.com/pumpfun_tv/status/1966406539163344973" target="_blank" className={styles.hidden}>
				<video src="/clip/2.mp4" autoPlay muted loop playsInline poster="/clip/2.png" />
					<p>
						<FaCommentAlt />
						<span>WTFFFF</span>
					</p>
				</Link>
				<Link href="https://x.com/yoxics/status/1966240543819858356" target="_blank" className={styles.hidden}>
				<video src="/clip/3.mp4" autoPlay muted loop playsInline poster="/clip/3.png" />
					<p>
						<FaCommentAlt />
						<span>BIG W</span>
					</p>
				</Link>
				<Link href="https://x.com/gainzy222/status/1966762539053695034" target="_blank" className={styles.hidden}>
				<video src="/clip/4.mp4" autoPlay muted loop playsInline poster="/clip/4.png" />
					<p>
						<FaCommentAlt />
						<span>That&apos;s Crazyy</span>
					</p>
				</Link>

				<Link href={app} className={`${styles.hidden} ${styles.button}`}>
					<p>+</p>
					<p>Try Clipify now!</p>
				</Link>


			</div>
		</div>
	);
}
