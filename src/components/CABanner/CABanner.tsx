"use client";

import styles from "./CABanner.module.css";
import { useState } from "react";

const CA = "PLACEHOLDER_CONTRACT_ADDRESS";

export default function CABanner() {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(CA);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className={styles.banner} onClick={handleCopy}>
			<p>
				<span className={styles.label}>CA:</span>
				<span className={styles.address}>{CA}</span>
				<span className={styles.copy}>{copied ? "Copied!" : "Click to copy"}</span>
			</p>
		</div>
	);
}
