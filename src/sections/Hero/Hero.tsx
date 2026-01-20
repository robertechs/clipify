import styles from "./Hero.module.css";
import Image from "next/image";
import { IoIosHeart } from "react-icons/io";
import { FaEye } from "react-icons/fa6";
import { FaCommentAlt } from "react-icons/fa";
import Link from "next/link";

export const twitter = "https://x.com/ClipifySolana";
export const chart = "https://dexscreener.com";
export const buy = "https://pump.fun";
export const app = "/stream";

export default function Hero() {
	return (
		<div className={styles.hero}>
			<div className={styles.content}>
				<h1>Drop a Pump.fun link.<br/>Get instant <span>viral clips.</span></h1>
				
				<p>The Al clipper for Pump.fun streams.<br/>  Viral moments, saved and shared instantly.</p>

				<div className={styles.buttons}>
					<Link href={app}><button>Try Clipify</button></Link>
					<Link href={twitter} target="_blank"><button>View Popular Clips</button></Link>
				</div>
			</div>

			<div className={styles.image}>

				<div className={styles.topLeft}>
					<p>
						<FaCommentAlt />
						<span>W</span>	
					</p>
					<p>
						<FaCommentAlt />
						<span>LMAOO</span>
					</p>
				</div>
				<div className={styles.topRight}>
					<p>
						<FaEye />
						<span>2300</span>	
					</p>
					<p>
						<IoIosHeart />
						<span>1299</span>
					</p>
				</div>

				<Image src="/clip.png" alt="Hero" width={393} height={217} className={styles.clip} />
				<p className={styles.link}><span>https://pump.fun/coin/EfgEGG9PxLhyk1wqtqgGnwgfVC7JYic3vC9BCWLvpump</span></p>

			</div>
		</div>
	);
}
