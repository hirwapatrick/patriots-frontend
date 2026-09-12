import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const navRef = useRef(null);
  const linkRefs = useRef([]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/team", label: "Team" },
    { to: "/games", label: "Games" },
    { to: "/news", label: "News" },
    { to: "/gallery", label: "Gallery" },
    { to: "/club", label: "Club" },
  ];

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  useEffect(() => {
    const idx = links.findIndex((l) => isActive(l.to));
    setActiveIdx(idx);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleEscape = useCallback((e) => { if (e.key === "Escape") setMobileOpen(false); }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.removeEventListener("keydown", handleEscape); document.body.style.overflow = ""; };
  }, [mobileOpen, handleEscape]);

  return (
    <>
      {/* Mobile backdrop */}
      <div className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[999] transition-all duration-500 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setMobileOpen(false)} />

      {/* Navbar */}
      <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 navbar-glass ${scrolled ? "scrolled" : ""}`}>
        {/* Top red hairline */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red/70 to-transparent pointer-events-none" />

        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 px-5 md:px-8">
          {/* Logo */}
          <Link to="/" className="no-underline flex items-center group" aria-label="Patriots BBC — Home">
            <img src="/logo.png" alt="Patriots BBC" className="h-9 md:h-10 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(227,27,35,0.35)] transition-opacity duration-300 group-hover:opacity-90" />
          </Link>

          {/* Desktop Nav (centered) */}
          <ul className="hidden md:flex items-center gap-1 flex-1 justify-center" ref={navRef}>
            {links.map((link, i) => {
              const active = isActive(link.to);
              return (
                <li key={link.to} ref={(el) => linkRefs.current[i] = el}>
                  <Link to={link.to}
                    className={`relative p-2 px-3.5 text-[0.7rem] font-semibold uppercase tracking-[2px] transition-all duration-300 no-underline block group ${active ? "text-white" : "text-white/45 hover:text-white/90"}`}>
                    {link.label}
                    <span className={`absolute left-1/2 -translate-x-1/2 bottom-[1px] h-[2px] rounded-full bg-red transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_10px_rgba(227,27,35,0.6)] ${active ? "w-[70%]" : "w-0 group-hover:w-[50%]"}`} />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <Link to="/contact" className="btn-ripple hidden sm:inline-block px-5 py-2 bg-red text-white text-[0.65rem] font-bold uppercase tracking-[2px] hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.45)] transition-all duration-300 no-underline relative overflow-hidden">
              Contact
            </Link>

            {/* Mobile Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden relative z-[1002] p-2 -mr-2 group" aria-label="Toggle menu">
              <div className="relative w-6 h-6">
                <span className={`absolute left-0 w-6 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "top-[11px] rotate-45" : "top-[4px]"}`} />
                <span className={`absolute left-0 w-6 h-[1.5px] bg-white transition-all duration-300 top-[11px] ${mobileOpen ? "opacity-0 scale-x-0" : "opacity-100"}`} />
                <span className={`absolute left-0 w-6 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "top-[11px] -rotate-45" : "top-[18px]"}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 w-[320px] max-w-[85vw] h-full bg-[#080808]/90 backdrop-blur-xl z-[1001] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-l border-white/[0.05] flex flex-col ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Top red hairline */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red/60 to-transparent pointer-events-none" />

        {/* Mobile Header */}
        <div className="px-7 py-6 border-b border-white/[0.06]">
          <Link to="/" className="no-underline inline-block" onClick={() => setMobileOpen(false)} aria-label="Patriots BBC — Home">
            <img src="/logo.png" alt="Patriots BBC" className="h-9 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(227,27,35,0.35)]" />
          </Link>
        </div>

        {/* Mobile Links */}
        <div className="flex-1 py-6 overflow-y-auto">
          {links.map((link, i) => {
            const active = isActive(link.to);
            return (
              <Link key={link.to} to={link.to}
                style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
                className={`flex items-center justify-between px-7 py-4 text-[0.8rem] font-medium uppercase tracking-[2px] transition-all duration-500 no-underline ${mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"} ${active ? "text-red bg-red/5 border-r-2 border-red" : "text-gray-500 hover:text-white hover:bg-white/[0.02]"}`}>
                {link.label}
                <ChevronRight size={14} className={`transition-all duration-300 ${active ? "text-red translate-x-0" : "text-gray-700 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`} />
              </Link>
            );
          })}
        </div>

        {/* Mobile Footer */}
        <div className="px-7 py-6 border-t border-white/[0.06] space-y-3">
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="btn-ripple block text-center px-4 py-3 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] hover:bg-red-dark transition-all duration-300 no-underline relative overflow-hidden">
            Contact Us
          </Link>
        </div>

        {/* Decorative red accent */}
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-red/40 via-red/10 to-transparent" />
      </div>
    </>
  );
}
