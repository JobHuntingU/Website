import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import logo from '@/assets/Logo_1.svg';

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
					content="Brand guide for JobHuntingU including logo guidelines, brand personality, and approved color palette."
				/>
			</Helmet>

			<main className="bg-background text-foreground">
				<section className="relative overflow-hidden bg-slate-900 text-white">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(93,153,204,0.40),_transparent_45%)]" />
					<div className="section-container relative z-10 py-24 md:py-28">
						<motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center">
							<p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
								Brand Guide
							</p>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] leading-tight mb-6">
								Direct, in motion, and outcome-first.
							</h1>
							<p className="mx-auto max-w-3xl text-lg md:text-xl text-white/80 leading-relaxed">
								A simple visual system built to communicate momentum, clarity, and results
								without losing the human edge of the JobHuntingU brand.
							</p>
							<div className="mt-8 flex flex-wrap justify-center gap-4">
								<Button asChild size="lg">
									<a href="#logo-guidelines">View Logo System</a>
								</Button>
								<Button
									asChild
									variant="outline"
									size="lg"
									className="border-white/30 bg-white/5 text-white hover:bg-white/10"
								>
									<a href="#colours">See Colour Policy</a>
								</Button>
							</div>
						</motion.div>
					</div>
				</section>

				<section id="logo-guidelines" className="py-20 bg-background">
					<div className="section-container">
						<motion.div {...fadeInUp} className="mb-10">
							<p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-primary">
								Logo Guidelines
							</p>
							<h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em]">
								The mark is built for motion and clarity.
							</h2>
						</motion.div>

						<motion.div
							{...fadeInUp}
							className="grid gap-6 lg:grid-cols-[1.1fr_1.2fr]"
						>
							<Card className="overflow-hidden border border-border bg-card/80 shadow-brand">
								<div className="flex min-h-[260px] items-center justify-center bg-[#FAFAF9] p-8">
									<div className="flex items-center justify-center">
										<img
											src={logo}
											alt="JobHuntingU logo"
											className="h-24 w-auto max-w-full sm:h-28"
										/>
									</div>
								</div>
							</Card>

							<Card className="border border-border bg-card/80 shadow-brand">
								<CardContent className="space-y-5 p-6 md:p-8">
									<p className="text-base leading-relaxed text-muted-foreground">
										The Job Hunting U logo combines a black running figure facing right
										with the bold condensed wordmark “JOB HUNTING.” The icon represents
										momentum, action, and forward motion, while the wordmark delivers
										clarity and authority. Only the “U” is set in blue to create a
										memorable brand accent and signal the final, outcome-focused step in
										the customer journey.
									</p>
									<p className="text-base leading-relaxed text-muted-foreground">
										Built for digital, print, and promotional use, the system stays
										legible and strong across single-colour and full-colour applications.
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
								Logo Policy
							</p>
							<h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em]">
								Approved usage
							</h2>
						</motion.div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Allowed</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Use the logo on website headers, social graphics, proposals, and
												marketing materials.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Use the full-colour version for digital applications and clear
												backgrounds.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Use the logo in black and blue on white or off-white backgrounds.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Maintain clear space around the mark for readability and visual
												impact.
											</span>
										</li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Not Allowed</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>Do not stretch, distort, rotate, flip, or crop the logo.</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Do not change the colour balance or swap the blue accent.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Do not reduce the logo below minimum size or place it on noisy
												backgrounds.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Do not use the mark for unrelated materials or inconsistent brand
												messaging.
											</span>
										</li>
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
								Brand Personality
							</p>
							<h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em]">
								Direct, in motion, and outcome-first.
							</h2>
						</motion.div>

						<motion.div
							{...fadeInUp}
							className="rounded-3xl border border-border bg-[linear-gradient(135deg,rgba(93,153,204,0.08),rgba(15,23,42,0.02))] p-6 md:p-8 shadow-brand"
						>
							<p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-5xl">
								The Job Hunting U palette reflects a brand personality that is direct, in
								motion, and outcome-first. The colour system is built to feel confident,
								efficient, and action-oriented: black carries authority and clarity, the
								blue adds momentum and trust, and the off-white creates space for focus
								and calm. Together, these tones support a brand that moves quickly,
								communicates clearly, and keeps the customer’s results at the centre of
								every interaction.
							</p>
						</motion.div>
					</div>
				</section>

				<section id="colours" className="py-20 bg-muted/30">
					<div className="section-container">
						<motion.div {...fadeInUp} className="mb-10">
							<p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-primary">
								Colours
							</p>
							<h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em]">
								Colour Policy
							</h2>
						</motion.div>

						<div className="grid gap-6 md:grid-cols-3 mb-10">
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
											<span
												className="inline-flex items-center rounded-full border border-current/20 bg-black/5 px-2 py-1"
												data-copy-status
											>
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
										<p className="text-sm leading-relaxed text-muted-foreground">
											{color.usage}
										</p>
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
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Use the full palette across the website, print collateral, and
												social touchpoints.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Use black for headlines, text, and the core mark to establish
												contrast and authority.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Use blue for links, CTAs, hover states, and small emphasis
												details.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Use off-white as the primary background to keep content crisp
												and premium.
											</span>
										</li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Not Allowed</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Do not introduce alternate shades, tints, or colour variations
												outside the approved palette.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Do not apply blue as a replacement for body text or black as a
												background for reading.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Do not swap the function of each colour in a way that weakens
												hierarchy.
											</span>
										</li>
										<li className="flex gap-3">
											<span className="mt-1 text-[#5D99CC] text-lg">•</span>
											<span>
												Do not use the palette in a way that reduces contrast or creates
												inconsistency.
											</span>
										</li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<footer className="border-t border-border bg-background">
					<div className="section-container py-8 text-center">
						<p className="text-sm text-muted-foreground">
							Draft for Jerry&apos;s approval. Logo files and any official font are still
							to be confirmed.
						</p>
					</div>
				</footer>
			</main>
		</>
	);
};

export default BrandGuidePage;
