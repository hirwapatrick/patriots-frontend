import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { homepageAPI, playerAPI, gameAPI, newsAPI, sponsorAPI, galleryAPI } from "../services/api";
import { Loader2, ChevronRight, Trophy, Shield, Calendar, ArrowRight, MapPin, Zap } from "lucide-react";

function AnimatedCounter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const numericVal = parseInt(String(value).replace(/[^0-9]/g, ""));
    if (isNaN(numericVal) || numericVal === 0) { setCount(value); return; }
    const duration = 2000;
    const steps = 60;
    const increment = numericVal / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericVal) { setCount(numericVal); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const [homepage, setHomepage] = useState(null);
  const [players, setPlayers] = useState([]);
  const [upcomingGame, setUpcomingGame] = useState(null);
  const [news, setNews] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      homepageAPI.get().catch(() => ({ data: null })),
      playerAPI.getAll({}).catch(() => ({ data: [] })),
      gameAPI.getUpcoming().catch(() => ({ data: [] })),
      newsAPI.getAll({ limit: 4 }).catch(() => ({ data: [] })),
      sponsorAPI.getAll().catch(() => ({ data: [] })),
      galleryAPI.getAll({ limit: 6 }).catch(() => ({ data: [] })),
    ]).then(([hp, pl, gm, nw, sp, gl]) => {
      setHomepage(hp.data);
      setPlayers(pl.data);
      setUpcomingGame(gm.data[0] || null);
      setNews(nw.data);
      setSponsors(sp.data);
      setGallery(gl.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
      <div className="basketball-loader" />
      <span className="text-[0.65rem] uppercase tracking-[4px] text-gray-500 font-bold">Loading</span>
    </div>
  );

  const stats = homepage?.statistics || [];

  return (
    <div>
      {/* Hero */}
      <section className="hero relative h-[100svh] min-h-[600px] flex items-end pb-24 overflow-hidden bg-black">
        <div className="hero-bg absolute inset-0">
          <img src={homepage?.hero?.backgroundImage || "/default-hero.jpg"} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="hero-overlay absolute inset-0" />

        {/* Floating particles */}
        <div className="particle-bg">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dot" style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              width: `${2 + (i % 2)}px`,
              height: `${2 + (i % 2)}px`,
            }} />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="hero-text-reveal">
            <span className="inline-flex items-center gap-2 font-heading text-[0.8rem] tracking-[6px] text-red mb-6 uppercase">
              <span className="w-8 h-[1px] bg-red" />
              Est. {homepage?.hero?.year || "2012"} — Kigali, Rwanda
            </span>
          </div>
          <h1 className="hero-text-reveal-delayed font-heading text-[clamp(3rem,10vw,7.5rem)] uppercase tracking-[4px] leading-[0.88] mb-6 text-white whitespace-pre-line">
            {homepage?.hero?.title || "Patriots\nBasketball\nClub"}
          </h1>
          <div className="hero-line-reveal w-[80px] h-[3px] bg-gradient-to-r from-red to-red/30 mb-8" />
          <p className="hero-subtitle-reveal text-gray-400 text-[0.95rem] font-light leading-relaxed max-w-[440px] mb-10">
            {homepage?.hero?.subtitle || "Kigali's premier basketball club competing in the Rwanda Basketball League."}
          </p>
          <div className="hero-buttons-reveal flex flex-wrap gap-3">
            <Link to="/games" className="btn-ripple inline-flex items-center gap-2 px-7 py-3.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_6px_40px_rgba(227,27,35,0.35)] transition-all duration-300 no-underline relative overflow-hidden">
              View Schedule <ChevronRight size={14} strokeWidth={2} />
            </Link>
            <Link to="/team" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/[0.04] border border-white/[0.1] text-white text-[0.7rem] font-bold uppercase tracking-[2px] hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-px transition-all duration-300 no-underline backdrop-blur-sm">
              Meet the Team <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[0.55rem] uppercase tracking-[3px] text-gray-500 font-bold">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-red/50 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-red animate-[shimmer_2s_ease-in-out_infinite]" style={{ animationDuration: '1.5s' }} />
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="bg-black border-y border-white/[0.04] py-12">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 grid grid-cols-[repeat(4,1fr)] gap-[1px]">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#0a0a0a] text-center py-8 group hover:bg-[#0f0f0f] transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative font-heading text-[clamp(2rem,4vw,3.8rem)] leading-none tracking-[1px] text-red">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="relative text-gray-500 text-[0.65rem] font-bold uppercase tracking-[3px] mt-3">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Game */}
      {upcomingGame && (
        <section className="bg-black py-16 px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red rounded-full animate-[glowPulse_2s_ease-in-out_infinite]" />
                <span className="font-heading text-[0.85rem] tracking-[4px] text-white uppercase">Next Game</span>
              </div>
              <Link to="/games" className="animated-link text-[0.65rem] text-gray-500 font-bold uppercase tracking-[2px] hover:text-red transition-colors no-underline inline-flex items-center gap-1">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <Link to={`/games/${upcomingGame._id}`} className="block game-card-hover-line group">
              <div className="bg-[#0c0c0e] border border-white/[0.06] p-8 md:p-12 transition-all duration-500">
                <div className="text-gray-600 text-[0.7rem] font-bold uppercase tracking-[3px] mb-10 flex items-center gap-3">
                  <Zap size={12} className="text-red" />
                  {upcomingGame.home ? "Home Game" : "Away Game"}
                </div>
                <div className="flex items-center justify-center gap-6 md:gap-14">
                  <div className="text-center flex-1">
                    <div className="font-heading text-[clamp(1.5rem,3vw,2.8rem)] tracking-[3px] uppercase text-white group-hover:text-red transition-colors duration-500">{upcomingGame.opponent}</div>
                    <div className="text-gray-600 text-[0.65rem] font-bold uppercase tracking-[3px] mt-2">{upcomingGame.home ? "vs" : "at"}</div>
                  </div>
                  <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <div className="text-center">
                    <div className="font-heading text-[3rem] md:text-[4rem] leading-none text-red tracking-[1px] score-flash">
                      {new Date(upcomingGame.date).toLocaleDateString("en-US", { day: "numeric" })}
                    </div>
                    <div className="font-heading text-[0.8rem] tracking-[3px] text-white/60 mt-2">
                      {new Date(upcomingGame.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </div>
                  </div>
                </div>
                {/* Venue line */}
                {upcomingGame.venue && (
                  <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-center gap-2 text-gray-600 text-[0.65rem] uppercase tracking-[2px]">
                    <MapPin size={11} strokeWidth={1.5} />
                    {upcomingGame.venue}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Players */}
      {players.length > 0 && (
        <section className="bg-[#050505] py-24 px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-2 font-heading text-[0.75rem] tracking-[5px] text-red mb-2 uppercase">
                  <span className="w-6 h-[1px] bg-red" />
                  Roster
                </span>
                <h2 className="font-heading text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.9] tracking-[1px]">Players</h2>
              </div>
              <Link to="/team" className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/[0.08] text-white/40 text-[0.65rem] font-bold uppercase tracking-[2px] hover:text-white hover:border-white/20 hover:-translate-y-px transition-all duration-300 no-underline">
                View All <ChevronRight size={13} strokeWidth={2} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2px]">
              {players.slice(0, 4).map((p, i) => (
                <Link key={p._id} to={`/team/${p._id}`}
                  className="group block bg-[#0a0a0a] overflow-hidden border border-white/[0.04] hover:border-red/20 transition-all duration-500 no-underline card-enter relative"
                  style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="aspect-[3/4] overflow-hidden relative">
                    {p.photo ? (
                      <img src={p.photo} alt={`${p.firstName} ${p.lastName}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0c0c0e]">
                        <Shield size={48} strokeWidth={1} className="text-white/10 group-hover:text-red/20 transition-colors duration-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-5 text-center relative">
                    <div className="font-heading text-[2rem] leading-none text-red tracking-[1px] group-hover:scale-110 transition-transform duration-300">{p.jerseyNumber}</div>
                    <div className="font-heading text-[0.8rem] tracking-[2px] uppercase text-white mt-1 group-hover:text-red transition-colors duration-300">{p.firstName}</div>
                    <div className="text-gray-500 text-[0.6rem] font-bold uppercase tracking-[3px] mt-1">{p.position}</div>
                  </div>
                  {/* Red top border glow on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Legacy / History */}
      {homepage?.clubStory && (
        <section className="bg-black text-white py-28 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red/[0.02] rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-[1200px] mx-auto grid grid-cols-[1fr_1fr] gap-20 items-center max-md:grid-cols-1 max-md:gap-10 relative z-10">
            <div className="reveal">
              <div className="w-[12px] h-[12px] bg-red mb-6 relative">
                <div className="absolute inset-0 bg-red animate-[glowPulse_3s_ease-in-out_infinite]" />
              </div>
              <span className="inline-block font-heading text-[0.75rem] tracking-[5px] text-red mb-3 uppercase">Our Story</span>
              <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] uppercase tracking-[2px] leading-[0.95] mb-8">{homepage.clubStory.title}</h2>
              <p className="text-gray-400 leading-[1.9] font-light text-[0.95rem]">{homepage.clubStory.content?.slice(0, 200)}...</p>
              <Link to="/club" className="animated-link inline-flex items-center gap-2 mt-8 text-[0.65rem] font-bold uppercase tracking-[2px] text-red no-underline">
                Read More <ChevronRight size={12} />
              </Link>
            </div>
            {homepage.clubStory.image && (
              <div className="overflow-hidden reveal reveal-delay-2 relative">
                <img src={homepage.clubStory.image} alt="" className="w-full h-full object-cover relative z-10" />
                <div className="absolute -bottom-4 -right-4 w-full h-full border border-red/20 z-0" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* News */}
      {news.length > 0 && (
        <section className="bg-[#050505] py-24 px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-2 font-heading text-[0.75rem] tracking-[5px] text-red mb-2 uppercase">
                  <span className="w-6 h-[1px] bg-red" />
                  Latest
                </span>
                <h2 className="font-heading text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.9] tracking-[1px]">News</h2>
              </div>
              <Link to="/news" className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/[0.08] text-white/40 text-[0.65rem] font-bold uppercase tracking-[2px] hover:text-white hover:border-white/20 hover:-translate-y-px transition-all duration-300 no-underline">
                All News <ChevronRight size={13} strokeWidth={2} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
              {news.map((n, i) => (
                <Link key={n._id} to={`/news/${n._id}`}
                  className="group block bg-[#0a0a0a] overflow-hidden border border-white/[0.04] hover:border-white/[0.08] transition-all duration-500 no-underline glow-card card-enter"
                  style={{ animationDelay: `${i * 0.1}s` }}>
                  {n.featuredImage && <div className="aspect-[16/7] overflow-hidden"><img src={n.featuredImage} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" /></div>}
                  <div className="p-7">
                    {n.category && <span className="text-[0.6rem] font-bold uppercase tracking-[3px] text-red">{n.category}</span>}
                    <h3 className="font-heading text-[1.15rem] tracking-[1px] uppercase mt-2 text-white group-hover:text-red transition-colors duration-300 leading-tight">{n.title}</h3>
                    <p className="text-gray-500 text-[0.8rem] mt-3 font-light line-clamp-2">{n.excerpt}</p>
                    <div className="mt-5 flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-[2px] text-gray-600 group-hover:text-red transition-all duration-300">
                      Read Article <ChevronRight size={11} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {gallery.length > 0 && (
        <section className="bg-black py-24 px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-2 font-heading text-[0.75rem] tracking-[5px] text-red mb-2 uppercase">
                  <span className="w-6 h-[1px] bg-red" />
                  Moments
                </span>
                <h2 className="font-heading text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.9] tracking-[1px]">Gallery</h2>
              </div>
              <Link to="/gallery" className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/[0.08] text-white/40 text-[0.65rem] font-bold uppercase tracking-[2px] hover:text-white hover:border-white/20 hover:-translate-y-px transition-all duration-300 no-underline">
                View All <ChevronRight size={13} strokeWidth={2} />
              </Link>
            </div>
            <div className="gallery-grid">
              {gallery.map((img, i) => (
                <Link key={img._id} to="/gallery" className="gallery-item block overflow-hidden relative group no-underline card-enter" style={{ animationDelay: `${i * 0.08}s` }}>
                  <img src={img.imageUrl} alt={img.caption || "Gallery photo"} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
                    <div>
                      <div className="w-6 h-[1px] bg-red mb-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      <span className="text-white text-[0.8rem] font-semibold uppercase tracking-[1px]">{img.caption || "View"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sponsors Marquee */}
      {sponsors.length > 0 && (
        <section className="bg-[#050505] py-16 border-y border-white/[0.04]">
          <div className="max-w-[1200px] mx-auto text-center mb-10">
            <span className="inline-flex items-center gap-2 font-heading text-[0.75rem] tracking-[5px] text-red mb-2 uppercase justify-center">
              <span className="w-6 h-[1px] bg-red" />
              Partners
              <span className="w-6 h-[1px] bg-red" />
            </span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-[1px]">Our Sponsors</h2>
          </div>
          <div className="sponsor-marquee">
            <div className="marquee-track">
              {[...sponsors, ...sponsors].map((s, i) => (
                <a key={`${s._id}-${i}`} href={s.website || "#"} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center h-[60px] opacity-40 hover:opacity-100 transition-all duration-500 hover:scale-110 no-underline group">
                  {s.logo ? <img src={s.logo} alt={s.name} className="h-[40px] md:h-[48px] w-auto object-contain group-hover:drop-shadow-[0_0_8px_rgba(227,27,35,0.3)] transition-all duration-500" /> : <span className="font-heading text-[1.2rem] tracking-[2px] text-white/60 group-hover:text-white transition-colors">{s.name}</span>}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-red text-white py-28 px-6 md:px-8 text-center relative overflow-hidden section-red-clip">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rotate-45 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/10 rotate-12 pointer-events-none" />
        <div className="relative z-10">
          <div className="font-heading text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] uppercase tracking-[4px] mb-8">Join<br />The Family</div>
          <p className="mb-12 text-white/80 max-w-[400px] mx-auto font-light text-[1rem] leading-relaxed">Be part of Kigali&apos;s basketball story. Together, we build champions.</p>
          <Link to="/contact" className="btn-ripple inline-flex items-center gap-2 px-9 py-4 bg-white text-black text-[0.72rem] font-bold uppercase tracking-[2px] hover:bg-gray-100 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(255,255,255,0.2)] transition-all duration-300 no-underline relative overflow-hidden">
            Get In Touch <ChevronRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  );
}
