import Link from 'next/link';
import styles from './Header.module.css';
import Image from 'next/image';

const twitter = "https://x.com/ClipifyApp";
const chartUrl = "https://dexscreener.com/solana/clipify";
const buyUrl = "https://pump.fun/coin/B1oEzGes1QxVZoxR3abiwAyL4jcPRF2s2ok5Yerrpump?clip=20250909_171204%3A492661_20250909_171049";

export default function Header() {
	return (
		<div className={styles.header}>
			<div className={styles.logo}>
				<Image src="/logo.png" alt="Logo" width={32} height={32} />
				<h1>Clipify</h1>
			</div>

			<div className={styles.nav}>
				<Link href={twitter}>Twitter</Link>
				<Link href={chartUrl}>View Chart</Link>
				<Link href={buyUrl}>
					<button>Buy $CLIPIFY</button>
				</Link>

			</div>
		</div>
	);
}