'use client';
export const dynamic = 'force-dynamic';
import styles from "./page.module.css";
import Image from "next/image";
import { useState } from "react";
import { toast } from 'sonner';
import Link from "next/link";
/* https://pump.fun/coin/B1oEzGes1QxVZoxR3abiwAyL4jcPRF2s2ok5Yerrpump?clip=20250909_171204%3A492661_20250909_171049 */
export default function Home() {

	const [link, setLink] = useState("");

	return (
		<div className={styles.page}>
			<h1>Drop a link. Get instant <span>viral clips.</span></h1>

			<div className={styles.image}>
				<Image src="/clip.png" alt="Image" width={1920} height={1080} />
			</div>

			<div className={styles.input}>
				<Image src="/pumpfun.png" alt="pumpfun" width={20} height={20} />
				<input type="text" placeholder="Enter a Pump.fun stream link" value={link} onChange={(e) => setLink(e.target.value)} />
				<Link href={`/stream?url=${link}`}><button>Get Free Clips</button></Link>
			</div>
		</div>
	);
}
