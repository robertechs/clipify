import styles from "./page.module.css";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Hero from "@/sections/Hero/Hero";
import HowItWorks from "@/sections/HowItWorks/HowItWorks";
import Trending from "@/sections/Trending/Trending";
import FAQ from "@/sections/FAQ/FAQ";
import Footer from "@/components/Footer/Footer";

export default function Home() {
	return (
		<div className={styles.page}>
			<Image src="/background.png" alt="Background" width={1920} height={1080} className={styles.background} />
			<Header />
			<Hero />
			<HowItWorks />
			<Trending />
			<FAQ />
			<Footer />
		</div>
	);
}
