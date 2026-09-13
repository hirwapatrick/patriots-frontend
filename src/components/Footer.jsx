import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { settingsAPI } from "../services/api";
import { Mail, Phone, MapPin, ChevronRight, Shield, Heart } from "lucide-react";

const SocialIcon = ({ platform, size = 15 }) => {
  const icons = {
    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    twitter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    youtube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    ),
    tiktok: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.18z" />
      </svg>
    ),
  };
  return icons[platform] || null;
};

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsAPI.get().then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  const socialLinks = settings?.socialLinks || {
    instagram: "#",
    facebook: "#",
    twitter: "#",
    youtube: "#",
    tiktok: "#",
  };
  const socials = [
    { key: "instagram", label: "Instagram" },
    { key: "facebook", label: "Facebook" },
    { key: "twitter", label: "X / Twitter" },
    { key: "youtube", label: "YouTube" },
    { key: "tiktok", label: "TikTok" },
  ];

  const contactEmail = settings?.contactEmail || "info@patriots.com";
  const contactPhone = settings?.contactPhone || "+250 788 000 000";
  const contactAddress = settings?.address || "Kigali, Rwanda";

  return (
    <footer className="bg-black-soft text-white border-t border-white/[0.04] relative">
      {/* Top glow line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-red/60 to-transparent" />
      <div className="h-[40px] bg-gradient-to-b from-red/[0.04] to-transparent pointer-events-none" />

      {/* Main content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-12">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-14 mb-20 max-xl:grid-cols-2 max-xl:gap-10 max-sm:grid-cols-1">

          {/* Brand + Social */}
          <div className="reveal">
            <Link to="/" className="no-underline inline-block group">
              <img src="/logo.png" alt="Patriots BBC" className="h-12 md:h-14 w-auto object-contain filter drop-shadow-[0_2px_16px_rgba(227,27,35,0.35)] transition-opacity duration-300 group-hover:opacity-90" />
            </Link>
            <p className="text-gray-500 text-[0.82rem] mt-5 font-light leading-relaxed max-w-[280px]">
              {settings?.tagline || "Kigali's premier basketball club — competing at the highest level in the Rwanda Basketball League."}
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 mt-7">
              {socials.map(({ key, label }) => {
                if (!socialLinks[key]) return null;
                return (
                  <a key={key} href={socialLinks[key]} target="_blank" rel="noopener noreferrer" title={label}
                    className="social-icon-glow w-11 h-11 bg-white/[0.03] border border-white/[0.06] text-gray-500 flex items-center justify-center hover:bg-red hover:text-white hover:border-red transition-all duration-400">
                    <SocialIcon platform={key} size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="reveal reveal-delay-1">
            <h4 className="font-heading text-[0.7rem] tracking-[4px] text-red mb-7 uppercase flex items-center gap-2">
              <span className="w-4 h-[1px] bg-red" />
              Quick Links
            </h4>
            <ul className="list-none space-y-0">
              {[
                { to: "/", label: "Home" },
                { to: "/team", label: "Team" },
                { to: "/games", label: "Games" },
                { to: "/news", label: "News" },
                { to: "/gallery", label: "Gallery" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="group flex items-center gap-2.5 py-2.5 text-gray-500 text-[0.82rem] font-light hover:text-white transition-all duration-300 no-underline">
                    <ChevronRight size={10} strokeWidth={2} className="text-gray-700 group-hover:text-red group-hover:translate-x-0.5 transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Club */}
          <div className="reveal reveal-delay-2">
            <h4 className="font-heading text-[0.7rem] tracking-[4px] text-red mb-7 uppercase flex items-center gap-2">
              <span className="w-4 h-[1px] bg-red" />
              Club
            </h4>
            <ul className="list-none space-y-0">
              {[
                { to: "/club", label: "About Us" },
                { to: "/club#achievements", label: "Achievements" },
                { to: "/club#staff", label: "Staff" },
                { to: "/sponsors", label: "Sponsors" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="group flex items-center gap-2.5 py-2.5 text-gray-500 text-[0.82rem] font-light hover:text-white transition-all duration-300 no-underline">
                    <ChevronRight size={10} strokeWidth={2} className="text-gray-700 group-hover:text-red group-hover:translate-x-0.5 transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="reveal reveal-delay-3">
            <h4 className="font-heading text-[0.7rem] tracking-[4px] text-red mb-7 uppercase flex items-center gap-2">
              <span className="w-4 h-[1px] bg-red" />
              Contact
            </h4>
            <ul className="list-none space-y-4">
              <li>
                <a href={`mailto:${contactEmail}`} className="flex items-start gap-3.5 text-gray-500 text-[0.82rem] font-light hover:text-white transition-all duration-300 no-underline group">
                  <div className="w-9 h-9 bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-red/10 group-hover:border-red/20 transition-all duration-300">
                    <Mail size={13} strokeWidth={1.5} className="text-red" />
                  </div>
                  <span className="pt-1.5">{contactEmail}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${contactPhone}`} className="flex items-start gap-3.5 text-gray-500 text-[0.82rem] font-light hover:text-white transition-all duration-300 no-underline group">
                  <div className="w-9 h-9 bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-red/10 group-hover:border-red/20 transition-all duration-300">
                    <Phone size={13} strokeWidth={1.5} className="text-red" />
                  </div>
                  <span className="pt-1.5">{contactPhone}</span>
                </a>
              </li>
              <li className="flex items-start gap-3.5 text-gray-500 text-[0.82rem] font-light">
                <div className="w-9 h-9 bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={13} strokeWidth={1.5} className="text-red" />
                </div>
                <span className="pt-1.5">{contactAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex justify-between items-center max-sm:flex-col max-sm:gap-4 max-sm:text-center">
          <p className="text-gray-600 text-[0.65rem] uppercase tracking-[2px]">
            &copy; {new Date().getFullYear()} Patriots Basketball Club. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-gray-700 text-[0.6rem] uppercase tracking-[2px]">
            Built with <Heart size={9} strokeWidth={2} className="text-red fill-red" /> for champions
          </div>
        </div>
      </div>
    </footer>
  );
}
