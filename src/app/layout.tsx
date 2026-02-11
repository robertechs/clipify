import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
	fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
	fallback: ["ui-monospace", "SFMono-Regular", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
});

export const metadata: Metadata = {
	title: "Clipify",
	description: "Drop a link. Get instant viral clips.",
	openGraph: {
		title: "Clipify",
		description: "Drop a link. Get instant viral clips.",
		url: "https://clipify-omega.vercel.app",
		siteName: "Clipify",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Clipify - AI Clipper for Pump.fun",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Clipify",
		description: "Drop a link. Get instant viral clips.",
		images: ["/og-image.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Toaster />
				{children}
			</body>
		</html>
	);
}
