import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gameAPI, settingsAPI } from "../services/api";
import { Loader2, Calendar, ChevronRight, Trophy, Flame } from "lucide-react";

export default function Games() {
  const [seasons, setSeasons] = useState([]);
  const [activeSeason, setActiveSeason] = useState("");
  const [upcoming, setUpcoming] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsAPI.get().then((res) => {
      const s = res.data.seasons || [];
      setSeasons(s);
      setActiveSeason(s[0] || "");
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeSeason) return;
    Promise.all([
      gameAPI.getUpcoming({ season: activeSeason }).catch(() => ({ data: [] })),
      gameAPI.getResults({ season: activeSeason }).catch(() => ({ data: [] })),
    ]).then(([u, r]) => { setUpcoming(u.data); setResults(r.data); setLoading(false); });
  }, [activeSeason]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
      <div className="basketball-loader" />
      <span className="text-[0.65rem] uppercase tracking-[4px] text-gray-500 font-bold">Loading Games</span>
    </div>
  );

  return (
    <div>
      <section className="page-hero">
        <span className="inline-block font-heading text-[0.85rem] tracking-[6px] text-red mb-1 uppercase page-hero-subtitle">Schedule</span>
        <h1 className="font-heading text-[clamp(3rem,8vw,6rem)] uppercase tracking-[3px] leading-[0.9] page-hero-title">Games</h1>
      </section>

      {/* Season filter */}
      <section className="bg-[#050505] py-8 px-4 md:px-8 border-b border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto">
          <div className="filter-pill-container">
            {seasons.map((s) => (
              <button key={s} onClick={() => { setActiveSeason(s); setLoading(true); }}
                className={`filter-pill ${activeSeason === s ? "active" : ""}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050505] py-14 px-4 md:px-8 min-h-[50vh]">
        <div className="max-w-[1200px] mx-auto space-y-16">
          {/* Upcoming */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Flame size={16} strokeWidth={1.5} className="text-red" />
              <h2 className="font-heading text-[1.2rem] tracking-[3px] uppercase text-white">Upcoming</h2>
              {upcoming.length > 0 && <span className="text-[0.6rem] font-bold uppercase tracking-[2px] text-gray-600 bg-white/[0.04] px-2.5 py-1">{upcoming.length}</span>}
            </div>
            {upcoming.length === 0 ? (
              <p className="text-gray-600 text-[0.85rem]">No upcoming games.</p>
            ) : (
              <div className="space-y-[2px]">
                {upcoming.map((g, i) => (
                  <Link key={g._id} to={`/games/${g._id}`}
                    className="group block bg-[#0a0a0a] border border-white/[0.04] hover:border-white/[0.08] p-6 transition-all duration-400 no-underline card-enter relative overflow-hidden"
                    style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-red scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="text-center min-w-[60px] relative">
                          <div className="font-heading text-[2.2rem] leading-none text-red group-hover:scale-110 transition-transform duration-300">{new Date(g.date).getDate()}</div>
                          <div className="text-gray-500 text-[0.6rem] font-bold uppercase tracking-[2px] mt-0.5">{new Date(g.date).toLocaleDateString("en-US", { month: "short" })}</div>
                        </div>
                        <div>
                          <div className="font-heading text-[1rem] tracking-[2px] uppercase text-white group-hover:text-red transition-colors duration-300">{g.opponent}</div>
                          <div className="text-gray-600 text-[0.7rem] font-bold uppercase tracking-[2px] mt-0.5">{g.home ? "Home" : "Away"} &bull; {g.venue || "TBD"}</div>
                        </div>
                      </div>
                      <ChevronRight size={16} strokeWidth={1.5} className="text-gray-700 group-hover:text-red group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Trophy size={16} strokeWidth={1.5} className="text-red" />
              <h2 className="font-heading text-[1.2rem] tracking-[3px] uppercase text-white">Results</h2>
              {results.length > 0 && <span className="text-[0.6rem] font-bold uppercase tracking-[2px] text-gray-600 bg-white/[0.04] px-2.5 py-1">{results.length}</span>}
            </div>
            {results.length === 0 ? (
              <p className="text-gray-600 text-[0.85rem]">No results yet.</p>
            ) : (
              <div className="space-y-[2px]">
                {results.map((g, i) => {
                  const won = g.patriotsScore > g.opponentScore;
                  return (
                    <Link key={g._id} to={`/games/${g._id}`}
                      className="group block bg-[#0a0a0a] border border-white/[0.04] hover:border-white/[0.08] p-6 transition-all duration-400 no-underline card-enter relative overflow-hidden"
                      style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className={`absolute top-0 left-0 w-[2px] h-full transition-transform duration-500 origin-top ${won ? "bg-red scale-y-0 group-hover:scale-y-100" : "bg-gray-700 scale-y-0 group-hover:scale-y-100"}`} />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="text-center min-w-[60px]">
                            <div className="font-heading text-[2.2rem] leading-none text-red">{new Date(g.date).getDate()}</div>
                            <div className="text-gray-500 text-[0.6rem] font-bold uppercase tracking-[2px] mt-0.5">{new Date(g.date).toLocaleDateString("en-US", { month: "short" })}</div>
                          </div>
                          <div>
                            <div className="font-heading text-[1rem] tracking-[2px] uppercase text-white group-hover:text-red transition-colors duration-300">{g.opponent}</div>
                            <div className="text-gray-600 text-[0.7rem] font-bold uppercase tracking-[2px] mt-0.5">{g.home ? "Home" : "Away"}</div>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div className="font-heading text-[1.5rem] tracking-[1px]">
                            <span className="text-red">{g.patriotsScore}</span>
                            <span className="text-gray-700 mx-1.5">—</span>
                            <span className="text-white">{g.opponentScore}</span>
                          </div>
                          <span className={`text-[0.6rem] font-bold uppercase tracking-[2px] px-3 py-1.5 ${won ? "badge-win" : "badge-loss"}`}>
                            {won ? "W" : "L"}
                          </span>
                          <ChevronRight size={16} strokeWidth={1.5} className="text-gray-700 group-hover:text-red group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
