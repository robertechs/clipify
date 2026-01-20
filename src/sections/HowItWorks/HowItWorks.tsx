import { app } from "@/sections/Hero/Hero";
import styles from "./HowItWorks.module.css";
import Link from "next/link";


export default function HowItWorks() {
	return (
		<div className={styles.howItWorks}>
			<div className={styles.head}>
				<div className={styles.left}>
					<h1>How Clipify Works</h1>
					<p>From link to viral-ready clip in just three steps.<br/>No editing, no wasted time just highlights.</p>
				</div>	

				<button>
					<Link href={app}>Start Clipping Now</Link>
					
				</button>

			</div>

			<div className={styles.content}>
				<div>
					<div className={styles.text}>
						<h1>Paste Link</h1>
						<p>Drop Any Pump.fun stream link</p>
					</div>
				</div>	

				<div>
					<div className={styles.text}>
						<h1>AI Find Highlights</h1>
						<p>Clipify auto-detects the best moments</p>
					</div>
				</div>	

				<div>
					<div className={styles.text}>
						<h1>Get ready-to-share clips</h1>
						<p>Formatted for TikTok, Twitter, and more.</p>
					</div>
				</div>	

			</div>
		</div>
	);
}
