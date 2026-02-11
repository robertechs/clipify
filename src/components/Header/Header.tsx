import Link from 'next/link';
import styles from './Header.module.css';
import Image from 'next/image';
import { twitter, chart, buy } from '@/sections/Hero/Hero';

export default function Header() {
	return (
		<div className={styles.header}>
			<Link href="/" className={styles.logo}>
				<Image src="/logo.png" alt="Logo" width={32} height={32} />
				<h1>Clipify</h1>
			</Link>

		<div className={styles.nav}>
			<Link href={twitter}>X (Twitter)</Link>
			<Link href={chart}>View Chart</Link>
			<Link href={buy}>
				<button>Buy $CLIPIFY</button>
			</Link>

		</div>
		</div>
	);
}
