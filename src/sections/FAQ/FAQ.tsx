'use client';
import styles from "./FAQ.module.css";
import { PiCaretDownFill, PiCaretUpFill, PiSealQuestionFill } from "react-icons/pi";
import { useState } from "react";

const questions = [
	{
		question: "What is Clipify?",
		answer: "Clipify is the first AI-powered clipper built for Pump.fun streams. It automatically detects hype spikes, captures the best moments, and turns them into viral-ready clips.",
	},
	{
		question: "Do I need to clip or edit manually?",
		answer: "No. Clipify does all the heavy lifting. The AI tracks engagement in real time and instantly creates polished clips. You just share.",
	},
	{
		question: "Who can use Clipify streamers or clippers?",
		answer: "Both. Streamers can clip their own content without relying on others, and clippers can catch viral moments from any streamer faster than ever.",
	},
	{
		question: "Where can I share the clips?",
		answer: "Clips can be posted directly on X (Twitter), TikTok, or any other platform where you want to go viral.",
	},
	{
		question: "Is Clipify free?",
		answer: "Yes, Clipify is free to use.",
	}
];


export default function FAQ() {
	return (
		<div className={styles.faq}>
			<div className={styles.title}>
				<PiSealQuestionFill className={styles.icon} />
				<h1>Frequently Asked Questions</h1>
				<p>Everything you need to know about Clipify</p>
			</div>

			<div className={styles.questions}>

				{questions.map((question) => (
					<Question key={question.question} question={question.question} answer={question.answer} />
				))}

			</div>
		</div>
	);
}



export function Question({ question, answer }: { question: string, answer: string }) {

	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className={styles.question}>
			<div className={styles.head} onClick={() => setIsOpen(!isOpen)}>
				<h1>{question}</h1>
				<button >
					+
				</button>
			</div>
			{isOpen && <p className={styles.answer}>{answer}</p>}
		</div>
	);
}
