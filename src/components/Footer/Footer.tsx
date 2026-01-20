import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import { app, twitter, chart } from "@/sections/Hero/Hero";


export default function Footer() {
	return (
		<div className={styles.footer}>
			<div className={styles.content}>
				<div className={styles.text}>
					<h1>Try Clipify<br/>For Free.</h1>

					<p>Clipify uses AI to auto-detect the best moments frome<br/>Pump.fun streams so you can share highlights in seconds.</p>
					<button><Link href={app}>Try Clipify</Link></button>
				</div>

				<Image src="/group.png" alt="Group" width={1200} height={1044} className={styles.group} />
			</div>

			<div className={styles.navigation}>
				<div className={styles.logo}>
					<Image src="/logo.png" alt="Logo" width={32} height={32} />
					<h1>Clipify</h1>
				</div>

				<div className={styles.links}>
					<p>Pages</p>
					<Link href="#">About</Link>
					<Link href="#">How to acccess?</Link>
					<Link href="#">Trending</Link>
					<Link href="#">FAQ</Link>
				</div>


				<div className={styles.links}>
					<p>Socials</p>
					<Link href={twitter} target="_blank">X/ Twitter</Link>
					<Link href={chart} target="_blank">Chart</Link>
				</div>

				<p className={styles.copyright}>2025 Clipify. All rights reserved.</p>
			</div>
		</div>
	);
}
