import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Copy, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import logo from '@/assets/Logo_1.svg';

const logoDownloads = [
	{ title: 'Transparent PNG', variant: 'transparent', note: 'For presentations and design files' },
	{ title: 'One-colour black', variant: 'black', note: 'For print and single-colour applications' },
	{ title: 'One-colour white', variant: 'white', note: 'For dark backgrounds' },
];

const downloadLogoPng = async (variant) => {
	try {
		const img = new Image();
		await new Promise((resolve, reject) => {
			img.onload = resolve;
			img.onerror = reject;
			img.src = logo;
		});

		const canvas = document.createElement('canvas');
		const targetWidth = 2000;
		const aspectRatio = img.naturalWidth && img.naturalHeight ? img.naturalHeight / img.naturalWidth : 0.25;
		canvas.width = targetWidth;
		canvas.height = Math.round(targetWidth * aspectRatio);

		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(img, 0, 0, canvas.width, canvas.height);

		if (variant === 'black' || variant === 'white') {
			context.globalCompositeOperation = 'source-in';
			context.fillStyle = variant === 'black' ? '#000000' : '#FFFFFF';
			context.fillRect(0, 0, canvas.width, canvas.height);
		}

		const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
		if (!pngBlob) {
			throw new Error('Could not create PNG blob');
		}

		const pngUrl = URL.createObjectURL(pngBlob);
		const link = document.createElement('a');
		link.href = pngUrl;
		link.download =
			variant === 'transparent'
				? 'jhu-logo-transparent.png'
				: variant === 'black'
					? 'jhu-logo-one-color-black.png'
					: 'jhu-logo-one-color-white.png';
		document.body.appendChild(link);
		link.click();
		link.remove();

		setTimeout(() => URL.revokeObjectURL(pngUrl), 2000);
	} catch (error) {
		console.error('Logo download failed:', error);
	}
};

const palette = [
	{
		name: 'Black',
		hex: '#000000',
		rgb: 'RGB(0, 0, 0)',
		usage: 'Black is for the runner, wordmark, headlines, and text.',
		accent: 'bg-black text-white',
	},
	{
		name: 'Logo Blue',
		hex: '#5D99CC',
		rgb: 'RGB(93, 153, 204)',
		usage: 'Logo Blue is for links, buttons, highlights, and strategic accents.',
		accent: 'bg-[#5D99CC] text-white',
	},
	{
		name: 'Off-White',
		hex: '#FAFAF9',
		rgb: 'RGB(250, 250, 249)',
		usage: 'Off-White is for subtle backgrounds, framing, and supporting surfaces.',
		accent: 'bg-[#FAFAF9] text-black',
	},
];

const copyHex = async (event) => {
	const swatch = event.currentTarget;
	const hex = swatch.dataset.hex;

	try {
		await navigator.clipboard.writeText(hex);
		const status = swatch.querySelector('[data-copy-status]');
		const originalText = status.textContent;
		status.textContent = 'Copied';
		setTimeout(() => {
			status.textContent = originalText;
		}, 1200);
	} catch (error) {
		console.error('Unable to copy:', error);
		const status = swatch.querySelector('[data-copy-status]');
		status.textContent = 'Error';
		setTimeout(() => {
			status.textContent = 'Copy';
		}, 1200);
	}
};

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5 },
};

const BrandGuidePage = () => {
	return (
		<>
			<Helmet>
				<title>Brand Guide | JobHuntingU</title>
				<meta
					name="description"
					content="Brand guide for JobHuntingU covering logo usage, colour palette, typography, voice, and downloadable assets."
				/>
			</Helmet>

			<main className="bg-background text-foreground">
				<section className="relative overflow-hidden bg-slate-900 text-white">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(93,153,204,0.40),_transparent_45%)]" />
					<div className="section-container relative z-10 py-24 md:py-28">
						<motion.div {...fadeInUp} className="mx-auto max-w-4xl text-center">
							<p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
								Brand Guide
							</p>
							<h1 className="mb-6 text-4xl font-black leading-tight tracking-[-0.05em] md:text-5xl lg:text-6xl">
								Clarity. Momentum. Results.
							</h1>
							<p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl">
								JobHuntingU is built for people who need a clear next move, a practical plan, and a system that helps them get traction fast.
							</p>
						</motion.div>
					</div>
				</section>

				<section id="logo-guidelines" className="py-20 bg-background">
					<div className="section-container">
						<motion.div {...fadeInUp} className="mb-10">
							<p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-primary">
								Logo Guidelines
							</p>
							<h2 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">
								The mark is built for motion and clarity.
							</h2>
						</motion.div>

						<motion.div {...fadeInUp} className="grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
							<Card className="overflow-hidden border border-border bg-card/80 shadow-brand">
								<div className="flex min-h-[260px] items-center justify-center bg-[#FAFAF9] p-8">
									<img src={logo} alt="JobHuntingU logo" className="h-24 w-auto max-w-full sm:h-28" />
								</div>
							</Card>

							<Card className="border border-border bg-card/80 shadow-brand">
								<CardContent className="space-y-5 p-6 md:p-8">
									<p className="text-base leading-relaxed text-muted-foreground">
										The Job Hunting U logo combines a black running figure facing right with the bold condensed wordmark “JOB HUNTING.” The icon represents momentum, action, and forward motion, while the wordmark delivers clarity and authority. Only the “U” is set in blue to create a memorable brand accent and signal the final, outcome-focused step in the customer journey.
									</p>
									<p className="text-base leading-relaxed text-muted-foreground">
										The system is designed to stay legible across digital, print, and promotional assets while remaining strong in single-colour and full-colour use.
									</p>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</section>

				<section className="py-20 bg-muted/30">
					<div className="section-container">
						<motion.div {...fadeInUp} className="mb-10">
							<p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-primary">
								Logo Downloads
							</p>
							<h2 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">
								Ready for designers and partners.
							</h2>
						</motion.div>

						<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
							{logoDownloads.map((item) => (
								<Card key={item.title} className="border border-border bg-card shadow-brand">
									<CardContent className="p-5">
										<div className="mb-4 flex items-center justify-between">
											<div className="rounded-full bg-[#5D99CC]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#5D99CC]">
												Download
											</div>
											<Download className="h-4 w-4 text-muted-foreground" />
										</div>
										<div
											className={
												item.variant === 'white'
													? 'mb-3 flex min-h-[120px] items-center justify-center rounded-xl border border-border bg-black p-4'
													: 'mb-3 flex min-h-[120px] items-center justify-center rounded-xl border border-border bg-[#FAFAF9] p-4'
											}
										>
											<img
												src={logo}
												alt={item.title}
												className={
													item.variant === 'white'
														? 'max-h-[74px] w-auto max-w-full brightness-0 invert'
														: item.variant === 'black'
															? 'max-h-[74px] w-auto max-w-full brightness-0'
															: 'max-h-[74px] w-auto max-w-full'
												}
											/>
										</div>
										<p className="mb-2 text-lg font-semibold text-foreground">{item.title}</p>
										<p className="text-sm text-muted-foreground">{item.note}</p>
										<button
											type="button"
											onClick={() => downloadLogoPng(item.variant)}
											className="mt-4 inline-flex items-center text-sm font-semibold text-[#5D99CC] hover:underline"
										>
											Download PNG
										</button>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				<section className="py-20 bg-muted/30">
					<div className="section-container">
						<motion.div {...fadeInUp} className="mb-10">
							<p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-primary">
								Logo Policy
							</p>
							<h2 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">
								Clear rules, easy to enforce.
							</h2>
						</motion.div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Allowed</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use the logo on website headers, social graphics, proposals, and marketing materials.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use the full-colour version on white or off-white backgrounds.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Clear space: keep at least half the height of the “U” around the mark on all sides.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Minimum size: 120 px wide on screen or 25 mm wide in print.</span></li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Not Allowed</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not stretch, distort, rotate, flip, or crop the logo.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not change the colour balance or swap the blue accent.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not reduce below the minimum size or place the mark inside the required clear-space area.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not use the mark in a way that weakens the brand or makes the message harder to read.</span></li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section className="py-20 bg-background">
					<div className="section-container">
						<motion.div {...fadeInUp} className="mb-10">
							<p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-primary">
								Voice and Tone
							</p>
							<h2 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">
								Direct, practical, and outcome-first.
							</h2>
						</motion.div>

						<motion.div
							{...fadeInUp}
							className="rounded-3xl border border-border bg-[linear-gradient(135deg,rgba(93,153,204,0.08),rgba(15,23,42,0.02))] p-6 md:p-8 shadow-brand"
						>
							<p className="max-w-5xl text-base leading-relaxed text-muted-foreground md:text-lg">
								The brand should sound like a coach who knows the game and cuts through the noise. Clear, practical, and confident. No fluff. No vague promises. No jargon for its own sake. Every message should help someone make a better decision, take a smarter action, or move closer to the right role.
							</p>
						</motion.div>
					</div>
				</section>

				<section className="py-20 bg-muted/30">
					<div className="section-container">
						<motion.div {...fadeInUp} className="mb-10">
							<p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-primary">
								Typography
							</p>
							<h2 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">
								Clean, high-contrast, and easy to read.
							</h2>
						</motion.div>

						<div className="grid gap-6 lg:grid-cols-2">
							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Headlines</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use bold, high-contrast layouts with strong weight and tight tracking.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Keep headlines short, clear, and action-oriented.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use uppercase sparingly for emphasis and hierarchy.</span></li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Body Copy</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use strong contrast and readable rhythm to keep headlines and body copy clear.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Prioritize readability over decorative styling.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Keep line length comfortable and spacing generous enough to feel calm and clear.</span></li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section id="colours" className="py-20 bg-muted/30">
					<div className="section-container">
						<motion.div {...fadeInUp} className="mb-10">
							<p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-primary">
								Colours
							</p>
							<h2 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">
								Colour Policy
							</h2>
						</motion.div>

						<div className="mb-10 grid gap-6 md:grid-cols-3">
							{palette.map((color) => (
								<motion.button
									key={color.hex}
									type="button"
									onClick={copyHex}
									data-hex={color.hex}
									className={`group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-brand transition-all duration-200 hover:-translate-y-1 ${color.accent}`}
									whileHover={{ y: -4 }}
									whileTap={{ scale: 0.98 }}
									aria-label={`Copy ${color.name} hex code`}
								>
									<div className="flex min-h-[170px] flex-col justify-end p-4">
										<div className="mb-4 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em]">
											<span>{color.name}</span>
											<span className="inline-flex items-center rounded-full border border-current/20 bg-black/5 px-2 py-1" data-copy-status>
												Copy
											</span>
										</div>
										<div className="text-lg font-bold">{color.hex}</div>
									</div>
									<div className="bg-white/80 p-4 text-black">
										<div className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5D99CC]">
											<Copy className="h-3.5 w-3.5" />
											HEX {color.hex}
										</div>
										<p className="text-sm leading-relaxed text-muted-foreground">{color.usage}</p>
									</div>
								</motion.button>
							))}
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Allowed</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use the full palette across the website, print collateral, and social touchpoints.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use black for headlines, text, and the core mark to establish contrast and authority.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use blue for links, CTAs, hover states, and small emphasis details.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use off-white as the primary background to keep content crisp, calm, and premium.</span></li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Not Allowed</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not introduce alternate shades, tints, or colour variations outside the approved palette.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not apply blue as a replacement for body text or black as a background for reading.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not swap the functional purpose of each colour in a way that weakens hierarchy.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not use the palette in a way that reduces contrast or creates inconsistency.</span></li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
			</main>
		</>
	);
};

export default BrandGuidePage;
