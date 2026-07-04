"use client";

import React from "react";
import Link from "next/link";
import {
	Hexagon,
	InstagramLogo,
	LinkedinLogo,
	TwitterLogo,
	YoutubeLogo
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { tokens } from "@frontend/styles/tokens";

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
	children?: React.ReactNode;
	delay?: number;
};

function AnimatedContainer({
	delay = 0.1,
	children,
	...props
}: AnimatedContainerProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div {...(props as any)}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
			whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			{...props}
		>
			{children}
		</motion.div>
	);
}

const Footer: React.FC = () => {
	return (
		<footer
			className="w-full border-t border-teal-900/40 relative"
			style={{
				background: "linear-gradient(135deg, #020c10 0%, #051a1a 50%, #020c10 100%)",
			}}
		>
			{/* Decorative Elements */}
			<div className="absolute top-0 left-1/3 w-80 h-80 bg-teal-500/8 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
			<div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-400/6 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
			<div className="absolute top-1/2 left-0 w-48 h-48 bg-teal-600/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

			<div className={`${tokens.spacing.container} py-14 md:py-16 flex flex-col gap-10`}>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

					{/* Brand Column */}
					<AnimatedContainer className="text-center md:text-left flex flex-col items-center md:items-start">
						<Link href="/" className="flex items-center gap-3 mb-5 group">
							<div className="bg-gradient-to-br from-teal-400 to-teal-600 p-2 rounded-xl transition-transform group-hover:rotate-12 shadow-lg shadow-teal-500/20">
								<Hexagon size={22} weight="fill" className="text-white" />
							</div>
							<span className="text-xl font-bold tracking-tight text-white">
								Evansh Services
							</span>
						</Link>
						<p className="text-slate-400 leading-relaxed mb-6 font-medium text-sm max-w-xs">
							Empowering students through concept-based learning and expert guidance for a brighter future.
						</p>
						<div className="flex items-center gap-2.5 justify-center md:justify-start">
							<a href="#" className="w-9 h-9 rounded-full bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-300 hover:bg-teal-500 hover:text-white hover:border-teal-500 hover:scale-110 transition-all duration-200">
								<InstagramLogo size={17} weight="bold" />
							</a>
							<a href="#" className="w-9 h-9 rounded-full bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-300 hover:bg-teal-500 hover:text-white hover:border-teal-500 hover:scale-110 transition-all duration-200">
								<LinkedinLogo size={17} weight="bold" />
							</a>
							<a href="#" className="w-9 h-9 rounded-full bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-300 hover:bg-teal-500 hover:text-white hover:border-teal-500 hover:scale-110 transition-all duration-200">
								<TwitterLogo size={17} weight="bold" />
							</a>
							<a href="#" className="w-9 h-9 rounded-full bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-300 hover:bg-teal-500 hover:text-white hover:border-teal-500 hover:scale-110 transition-all duration-200">
								<YoutubeLogo size={17} weight="bold" />
							</a>
						</div>
					</AnimatedContainer>

					{/* Explore Column */}
					<AnimatedContainer delay={0.1} className="text-center md:text-left">
						<h3 className="text-teal-400 font-bold text-xs mb-5 uppercase tracking-[0.2em]">Explore</h3>
						<ul className="space-y-4">
							<li><Link href="/" className="text-slate-400 text-sm font-medium hover:text-teal-400 transition-colors">Home</Link></li>
							<li><Link href="/about" className="text-slate-400 text-sm font-medium hover:text-teal-400 transition-colors">About Us</Link></li>
							<li><Link href="/works" className="text-slate-400 text-sm font-medium hover:text-teal-400 transition-colors">Our Work</Link></li>
							<li><Link href="/services" className="text-slate-400 text-sm font-medium hover:text-teal-400 transition-colors">Services</Link></li>
							<li><Link href="/contact" className="text-slate-400 text-sm font-medium hover:text-teal-400 transition-colors">Contact</Link></li>
						</ul>
					</AnimatedContainer>

					{/* Contact Us Column */}
					<AnimatedContainer delay={0.2} className="text-center md:text-left">
						<h3 className="text-teal-400 font-bold text-xs mb-5 uppercase tracking-[0.2em]">Contact Us</h3>
						<ul className="space-y-5">
							<li>
								<span className="block text-[10px] uppercase tracking-widest text-teal-600 mb-1.5 font-semibold">Email</span>
								<a href="mailto:evanshservices24651@gmail.com" className="text-slate-200 text-sm font-semibold hover:text-teal-400 transition-colors duration-200">
									evanshservices24651@gmail.com
								</a>
							</li>
							<li>
								<span className="block text-[10px] uppercase tracking-widest text-teal-600 mb-1.5 font-semibold">Phone</span>
								<a href="tel:NA" className="text-slate-200 text-sm font-semibold hover:text-teal-400 transition-colors duration-200">
									NA
								</a>
							</li>
						</ul>
					</AnimatedContainer>

				</div>

				{/* Bottom Bar */}
				<div className="pt-5 border-t border-teal-900/30 flex flex-col md:flex-row justify-between items-center gap-3 text-center text-xs font-medium text-slate-500">
					<p>© {new Date().getFullYear()} Evansh Services. All rights reserved.</p>
					<div className="flex gap-6">
						<a href="#" className="hover:text-teal-400 transition-colors duration-200">Privacy</a>
						<a href="#" className="hover:text-teal-400 transition-colors duration-200">Terms</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
