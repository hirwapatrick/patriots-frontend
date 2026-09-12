import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { playerAPI } from "../services/api";
import { Loader2, Shield } from "lucide-react";

const POSITIONS = ["All", "Guard", "Forward", "Center"];

export default function Team() {
  const [players, setPlayers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePos, setActivePos] = useState("All");

  useEffect(() => {
    playerAPI.getAll({}).then((res) => { setPlayers(res.data); setFiltered(res.data); setLoading(false); });
  }, []);

  useEffect(() => {
    setFiltered(activePos === "All" ? players : players.filter((p) => p.position === activePos));
  }, [activePos, players]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
      <div className="basketball-loader" />
      <span className="text-[0.65rem] uppercase tracking-[4px] text-gray-500 font-bold">Loading Roster</span>
    </div>
  );

  return (
    <div>
      <section className="page-hero">
        <span className="inline-block font-heading text-[0.85rem] tracking-[6px] text-red mb-1 uppercase page-hero-subtitle">Roster</span>
        <h1 className="font-heading text-[clamp(3rem,8vw,6rem)] uppercase tracking-[3px] leading-[0.9] page-hero-title">Our Team</h1>
      </section>

      <section className="bg-[#050505] py-8 px-4 md:px-8 border-b border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto">
          <div className="filter-pill-container">
            {POSITIONS.map((pos) => (
              <button key={pos} onClick={() => setActivePos(pos)}
                className={`filter-pill ${activePos === pos ? "active" : ""}`}>
                {pos}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050505] py-14 px-4 md:px-8 min-h-[50vh]">
        <div className="max-w-[1200px] mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-600 py-20">
              <Shield size={48} strokeWidth={1} className="text-white/10 mx-auto mb-4" />
              <p className="text-[0.85rem] uppercase tracking-[2px]">No players found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2px]">
              {filtered.map((p, i) => (
                <Link key={p._id} to={`/team/${p._id}`}
                  className="group block bg-[#0a0a0a] overflow-hidden border border-white/[0.04] hover:border-red/20 transition-all duration-500 no-underline card-enter relative"
                  style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="aspect-[3/4] overflow-hidden relative">
                    {p.photo ? (
                      <img src={p.photo} alt={`${p.firstName} ${p.lastName}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0c0c0e]">
                        <Shield size={48} strokeWidth={1} className="text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Jersey number overlay on hover */}
                    <div className="absolute top-3 right-3 font-heading text-[3rem] leading-none text-red/0 group-hover:text-red/30 transition-all duration-500 group-hover:-translate-y-1">{p.jerseyNumber}</div>
                  </div>
                  <div className="p-5 text-center relative">
                    <div className="font-heading text-[2rem] leading-none text-red tracking-[1px] group-hover:scale-110 transition-transform duration-300">{p.jerseyNumber}</div>
                    <div className="font-heading text-[0.8rem] tracking-[2px] uppercase text-white mt-1.5 group-hover:text-red transition-colors duration-300">{p.firstName}</div>
                    <div className="text-gray-500 text-[0.6rem] font-bold uppercase tracking-[3px] mt-1">{p.position}</div>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
