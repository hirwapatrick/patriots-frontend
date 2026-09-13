import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { newsAPI, categoryAPI } from "../services/api";
import { Loader2, ChevronRight, Calendar } from "lucide-react";

export default function News() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      newsAPI.getAll({}).catch(() => ({ data: [] })),
      categoryAPI.getAll().catch(() => ({ data: [] })),
    ]).then(([n, c]) => { setPosts(n.data); setCategories(c.data); setLoading(false); });
  }, []);

  const filtered = activeCat === "All" ? posts : posts.filter((p) => p.category === activeCat);
  const featured = filtered[0];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
      <div className="basketball-loader" />
      <span className="text-[0.65rem] uppercase tracking-[4px] text-gray-500 font-bold">Loading News</span>
    </div>
  );

  return (
    <div>
      <section className="page-hero">
        <span className="inline-block font-heading text-[0.85rem] tracking-[6px] text-red mb-1 uppercase page-hero-subtitle">Latest</span>
        <h1 className="font-heading text-[clamp(3rem,8vw,6rem)] uppercase tracking-[3px] leading-[0.9] page-hero-title">News</h1>
      </section>

      <section className="bg-black py-8 px-4 md:px-8 border-b border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto">
          <div className="filter-pill-container">
            {[{ _id: "all", name: "All" }, ...categories].map((c) => {
              const name = c.name || "All";
              return (
                <button key={c._id || name} onClick={() => setActiveCat(name)}
                  className={`filter-pill ${activeCat === name ? "active" : ""}`}>
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-black py-14 px-4 md:px-8 min-h-[50vh]">
        <div className="max-w-[1200px] mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-600 py-20 text-[0.85rem] uppercase tracking-[2px]">No articles found.</div>
          ) : (
            <div className="space-y-[2px]">
              {/* Featured article */}
              {featured && (
                <Link to={`/news/${featured._id}`} className="group block bg-black-card overflow-hidden border border-white/[0.04] hover:border-white/[0.08] transition-all duration-500 no-underline mb-4 glow-card">
                  <div className="grid grid-cols-[1fr_1fr] max-md:grid-cols-1">
                    {featured.featuredImage && (
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img src={featured.featuredImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 max-md:bg-gradient-to-t" />
                      </div>
                    )}
                    <div className="p-8 md:p-10 flex flex-col justify-center relative">
                      {featured.category && (
                        <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[3px] text-red mb-3">
                          <span className="w-2 h-2 bg-red rounded-full animate-[glowPulse_2s_ease-in-out_infinite]" />
                          {featured.category}
                        </span>
                      )}
                      <h2 className="font-heading text-[clamp(1.5rem,3vw,2.2rem)] tracking-[1px] uppercase mt-2 text-white group-hover:text-red transition-colors duration-300 leading-tight">{featured.title}</h2>
                      <p className="text-gray-500 text-[0.85rem] mt-4 font-light line-clamp-3 leading-relaxed">{featured.excerpt}</p>
                      <div className="mt-6 flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-[2px] text-gray-600 group-hover:text-red transition-all duration-300">
                        Read Article <ChevronRight size={11} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Remaining articles */}
              {filtered.slice(1).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
                  {filtered.slice(1).map((n, i) => (
                    <Link key={n._id} to={`/news/${n._id}`}
                      className="group block bg-black-card overflow-hidden border border-white/[0.04] hover:border-white/[0.08] transition-all duration-500 no-underline glow-card card-enter"
                      style={{ animationDelay: `${i * 0.08}s` }}>
                      {n.featuredImage && <div className="aspect-[16/9] overflow-hidden"><img src={n.featuredImage} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" /></div>}
                      <div className="p-6">
                        {n.category && <span className="text-[0.6rem] font-bold uppercase tracking-[3px] text-red">{n.category}</span>}
                        <h3 className="font-heading text-[0.95rem] tracking-[1px] uppercase mt-1.5 text-white group-hover:text-red transition-colors duration-300 leading-tight">{n.title}</h3>
                        <p className="text-gray-500 text-[0.8rem] mt-2 font-light line-clamp-2">{n.excerpt}</p>
                        <div className="mt-4 flex items-center gap-2 text-[0.55rem] font-bold uppercase tracking-[2px] text-gray-600">
                          <Calendar size={10} />
                          {new Date(n.publishedAt || n.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
