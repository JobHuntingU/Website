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
		rgb: 'RGB 0, 0, 0',
		usage: 'Runner, wordmark, headlines, text',
		accent: 'bg-black text-white',
	},
	{
		name: 'Logo Blue',
		hex: '#5D99CC',
		rgb: 'RGB 93, 153, 204',
		usage: 'The U, links, buttons, small accents only',
		accent: 'bg-[#5D99CC] text-white',
	},
	{
		name: 'Off-White',
		hex: '#FAFAF9',
		rgb: 'RGB 250, 250, 249',
		usage: 'Page background',
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
					content="Brand guide for JobHuntingU covering logo usage, colour palette, and typography."
				/>
				<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/norwester" type="text/css" />
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
										Follow the guidelines below when using the logo for any purpose.
									</p>
									<p className="text-base leading-relaxed text-muted-foreground">
										The logo is a black running figure, mid-stride, facing right, next to 'JOB HUNTING' in bold condensed black capitals, with only the final U in blue (#5D99CC). The runner and the wordmark are one lockup.
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
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use the logo to market any Job Hunting U material.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use the logo for both print and web content.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use the high-resolution version of the logo for print.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use the full-colour logo on white or off-white wherever possible.</span></li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Not Allowed</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not cut, adjust, rotate, flip, reflect, or manipulate the logo.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not change the colour of the logo.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not retype the wordmark in another font.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not use the logo for non-Job Hunting U material.</span></li>
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
								Colour palette and usage
							</h2>
						</motion.div>

						<p className="mb-8 max-w-4xl text-base leading-relaxed text-muted-foreground md:text-lg">
							The Job Hunting U colour palette reflects our brand personality — Direct, In Motion, and Outcome-First. We show our Direct side through our core black, which is bold and high-contrast. We show our In Motion side through our logo blue, which pulls the eye forward to the U. We show our clear, professional side with our off-white.
						</p>

						<div className="mb-8 grid gap-6 md:grid-cols-3">
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
											<span>HEX {color.hex}</span>
											<span className="text-foreground/70">{color.rgb}</span>
										</div>
										<p className="text-sm leading-relaxed text-muted-foreground">{color.usage}</p>
									</div>
								</motion.button>
							))}
						</div>

						<p className="mb-10 text-base leading-relaxed text-muted-foreground">
							Black, blue, and off-white are sampled from the supplied logo file. Blue is an accent, not a background colour.
						</p>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Allowed</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use these colours for all material on the Job Hunting U site.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Use these colours for any Job Hunting U flyers, ads, or other company materials.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Colours should be used as intended (black headlines and text, blue buttons and links, off-white backgrounds).</span></li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Not Allowed</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not use slight variations of these colours.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not use completely different colours.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not swap colour purposes (e.g. no blue headlines as the default).</span></li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section id="typography" className="py-20 bg-background">
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
								<CardContent className="space-y-4">
									<div className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
										Role: Headlines
									</div>
									<div className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
										Font: Norwester
									</div>
									<div className="rounded-xl border border-border bg-[#FAFAF9] p-4 text-3xl uppercase leading-none tracking-[-0.04em] text-black" style={{ fontFamily: "'Norwester', sans-serif" }}>
										JOB HUNTING
									</div>
									<p className="text-sm leading-relaxed text-muted-foreground">
										Use: "Headlines, subheads, buttons. All caps, black (white on dark)."
									</p>
								</CardContent>
							</Card>

							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Body</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
										Role: Body
									</div>
									<div className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
										Font: DM Sans
									</div>
									<div className="space-y-2 rounded-xl border border-border bg-[#FAFAF9] p-4 text-base">
										<p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}>DM Sans regular — clear, open body text for the website.</p>
										<p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>DM Sans medium — emphasis for subheads and callouts.</p>
										<p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>DM Sans bold — strong emphasis for buttons and key actions.</p>
									</div>
									<p className="text-sm leading-relaxed text-muted-foreground">
										Use: "Body text, captions, forms. Regular for body, medium / bold for emphasis. DM Sans is the font already used on jobhuntingu.com."
									</p>
								</CardContent>
							</Card>
						</div>

						<div className="mt-8">
							<Card className="border border-border bg-card/80 shadow-brand">
								<CardContent className="p-6 md:p-8">
									<p className="text-base leading-relaxed text-muted-foreground">
										"Norwester is a condensed geometric sans serif by Jamie Wilson, free under the Open Font Licence. It is the closest style match to the logo letters we found: the J, B, G and U shapes match, and squished to 80% width it lines up with the logo in width too. It is not proven to be the original logo font — the logo is an image, and its exact font can only be confirmed from the designer's original file."
									</p>
								</CardContent>
							</Card>
						</div>

						<div className="mt-8">
							<Card className="border border-border bg-card shadow-brand">
								<CardHeader>
									<CardTitle className="text-2xl">Typography Rules</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Never retype the logo. Use the logo image file.</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Do not stretch or squash Norwester in use (the 80% test was a comparison, not a rule).</span></li>
										<li className="flex gap-3"><span className="mt-1 text-[#5D99CC] text-lg">•</span><span>Norwester has a single weight: use size and colour for hierarchy, do not fake-bold it.</span></li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<div className="section-container pb-12 pt-4">
					<p className="text-center text-xs italic text-muted-foreground/80">
						Draft for Jerry's approval. Logo files are still to be confirmed — this short guide does not invent them.
					</p>
				</div>
			</main>
		</>
	);
};

export default BrandGuidePage;
