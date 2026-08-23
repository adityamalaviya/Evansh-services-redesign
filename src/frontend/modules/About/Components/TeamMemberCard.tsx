import Image from "next/image";
import { LinkedinLogo } from "@phosphor-icons/react";

interface TeamMemberCardProps {
  name: string;
  role: string;
  src?: string;
  linkedinUrl?: string;
}

export default function TeamMemberCard({
  name,
  role,
  src,
  linkedinUrl
}: TeamMemberCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-xl transition-all hover:scale-[1.02] duration-300">
      {/* Circular Avatar Placeholder / Image Slot */}
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 mb-6 flex items-center justify-center bg-[#14B8A6] border-4 border-teal-50 shadow-inner">
        {src ? (
          <Image
            src={src}
            alt={name}
            width={112}
            height={112}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#14B8A6]" />
        )}
      </div>

      {/* Name and Role Info */}
      <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2">
        {name}
      </h3>
      <p className="text-[#14B8A6] font-bold text-xs md:text-sm uppercase tracking-wider mb-4">
        {role}
      </p>

      {/* Clickable LinkedIn Logo replacing previous dash divider */}
      <a
        href={linkedinUrl || "https://www.linkedin.com"}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full flex items-center justify-center text-[#14B8A6] hover:bg-teal-50 hover:text-[#0A66C2] transition-all hover:scale-110"
        aria-label={`${name}'s LinkedIn profile`}
      >
        <LinkedinLogo size={24} weight="fill" />
      </a>
    </div>
  );
}
