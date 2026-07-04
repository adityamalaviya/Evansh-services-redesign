"use client";

import React from 'react';
import { StickyFooter } from "@/components/ui/sticky-footer";
import Lenis from 'lenis';
import { ArrowDownIcon } from 'lucide-react';

export default function DemoOne() {
	React.useEffect(() => {
		const lenis = new Lenis();

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);
		
		return () => {
			lenis.destroy();
		};
	}, []);

	return (
		<div className="relative w-full min-h-screen bg-[#FFF2E9]">
			<div className="flex h-screen flex-col items-center justify-center gap-10">
				<h1 className="max-w-xl text-center">
					<span className="text-foreground/80 text-4xl font-semibold">
						example of
					</span>
					<br />
					<span className="text-5xl font-bold">Sticky Footer</span>
				</h1>
				<div className="flex items-center gap-2">
					<p>Scroll down</p>
					<ArrowDownIcon className="size-4 animate-bounce" />
				</div>
			</div>
			<StickyFooter />
		</div>
	);
}
