// components/LaunchTerminal.js
"use client";

import React, { useState, useEffect } from 'react';

const LaunchTerminal = ({ serverNow }) => {
	// تاریخ‌ها حالا با Z مشخص شده‌اند تا به عنوان UTC تفسیر شوند
	const COUNTDOWN_START_DATE_STRING = '2025-08-30T20:00:00Z';
	const LAUNCH_DATE_STRING = '2025-09-01T02:00:00Z';

	const calculateInitialState = () => {
		const launchDate = new Date(LAUNCH_DATE_STRING);
		const startDate = new Date(COUNTDOWN_START_DATE_STRING);
		const now = new Date(serverNow);

		const totalDuration = launchDate.getTime() - startDate.getTime();
		const differenceToLaunch = launchDate.getTime() - now.getTime();

		let timeLeft = { days: 0, hours: '00', minutes: '00', seconds: '00' };
		if (differenceToLaunch > 0) {
			timeLeft = {
				days: Math.floor(differenceToLaunch / (1000 * 60 * 60 * 24)),
				hours: String(Math.floor((differenceToLaunch / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
				minutes: String(Math.floor((differenceToLaunch / 1000 / 60) % 60)).padStart(2, '0'),
				seconds: String(Math.floor((differenceToLaunch / 1000) % 60)).padStart(2, '0'),
			};
		}

		const elapsedTimeSinceStart = now.getTime() - startDate.getTime();
		let progress = 0;
		if (totalDuration > 0) {
			progress = Math.min(Math.floor((elapsedTimeSinceStart / totalDuration) * 100), 100);
		}
		if (now.getTime() < startDate.getTime()) progress = 0;
		if (now.getTime() >= launchDate.getTime()) progress = 100;

		return { timeLeft, progress };
	};

	const [timeLeft, setTimeLeft] = useState(calculateInitialState().timeLeft);
	const [progress, setProgress] = useState(calculateInitialState().progress);

	const [logs] = useState([
		'Booting system...',
		'Connecting to deployment server...',
		'Connection established.',
		'Starting compilation process...',
	]);

	useEffect(() => {
		const timer = setInterval(() => {
			const launchDate = new Date(LAUNCH_DATE_STRING);
			const startDate = new Date(COUNTDOWN_START_DATE_STRING);
			const totalDuration = launchDate.getTime() - startDate.getTime();
			const now = new Date(); // این به درستی زمان فعلی را می‌گیرد

			const differenceToLaunch = launchDate.getTime() - now.getTime();

			if (differenceToLaunch > 0) {
				setTimeLeft({
					days: Math.floor(differenceToLaunch / (1000 * 60 * 60 * 24)),
					hours: String(Math.floor((differenceToLaunch / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
					minutes: String(Math.floor((differenceToLaunch / 1000 / 60) % 60)).padStart(2, '0'),
					seconds: String(Math.floor((differenceToLaunch / 1000) % 60)).padStart(2, '0'),
				});
			} else {
				setTimeLeft({ days: 0, hours: '00', minutes: '00', seconds: '00' });
			}

			const elapsedTimeSinceStart = now.getTime() - startDate.getTime();
			let currentProgress = 0;
			if (totalDuration > 0) {
				currentProgress = Math.min(Math.floor((elapsedTimeSinceStart / totalDuration) * 100), 100);
			}
			if (now.getTime() < startDate.getTime()) currentProgress = 0;
			if (now.getTime() >= launchDate.getTime()) currentProgress = 100;

			setProgress(currentProgress);

		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const progressBarLength = 50;
	const filledLength = progress > 0 ? Math.floor(progressBarLength * (progress / 100)) : 0;
	const progressBar = `[${'■'.repeat(filledLength)}${'-'.repeat(progressBarLength - filledLength)}]`;

	return (
		<div className={"font-mono"} style={styles.container}>
			{/* ... بقیه کد JSX شما بدون هیچ تغییری ... */}
			<div className={"font-mono"} style={styles.terminal}>
				<div style={styles.header}>
					<span className={"font-mono"}>Initializing Project -- Do Not Close This Window</span>
				</div>
				<div style={styles.body}>
					{logs.map((log, index) => (
						<p key={index} style={styles.log}>
							<span style={styles.prompt}>&gt;</span> {log}
						</p>
					))}
					<p style={styles.log}><span style={styles.prompt}>&gt;</span> Deployment in progress...</p>
					<div style={styles.progressContainer}>
						<span style={styles.progressBar}>{progressBar}</span>
						<span style={styles.progressPercent}>{progress}%</span>
					</div>
					<p className={"font-mono"} style={styles.countdown}>
						TIME UNTIL LAUNCH: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
					</p>
					{progress >= 100 ? (
						<p style={{ color: '#3fb950', fontWeight: 'bold' }}>
							<span style={styles.prompt}>&gt;</span> SITE IS LIVE!
						</p>
					) : (
						<div style={styles.cursorContainer}>
							<span style={styles.prompt}>&gt;</span>
							<span style={styles.blinkingCursor}>_</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// ... استایل‌ها بدون تغییر باقی می‌مانند
const styles = {
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100vh',
		backgroundColor: '#0d1117',
		color: '#c9d1d9',
		padding: '20px',

	},
	terminal: {
		width: '100%',
		maxWidth: '800px',
		backgroundColor: '#161b22',
		border: '1px solid #30363d',
		borderRadius: '8px',
		boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
		overflow: 'hidden',
	},
	header: {
		backgroundColor: '#21262d',
		padding: '10px',
		color: '#8b949e',
		fontSize: '14px',
		textAlign: 'center',
		borderBottom: '1px solid #30363d',
	},
	body: {
		padding: '20px',
		fontSize: '16px',
		lineHeight: '1.6',
		height: '400px',
		overflowY: 'auto',
	},
	log: {
		margin: '0 0 5px 0',
	},
	prompt: {
		color: '#58a6ff',
		marginRight: '10px',
	},
	progressContainer: {
		display: 'flex',
		alignItems: 'center',
		marginTop: '20px',
		color: '#3fb950',
	},
	progressBar: {
		marginRight: '10px',
		letterSpacing: '2px',
	},
	progressPercent: {
		fontWeight: 'bold',
	},
	countdown: {
		fontSize: '20px',
		letterSpacing: '2px',
		marginTop: '15px',
		color: '#f0b949',
		fontWeight: 'bold',
	},
	cursorContainer: {
		marginTop: '10px',
	},
	blinkingCursor: {
		backgroundColor: '#c9d1d9',
		animation: 'blink 1s steps(2, start) infinite',
	},
};

export default LaunchTerminal;