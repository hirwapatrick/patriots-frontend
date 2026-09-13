import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { gameAPI } from "../services/api";
import { Loader2, ArrowLeft, MapPin, Trophy, Users, Calendar, Clock } from "lucide-react";

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameAPI.getById(id).then((res) => { setGame(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
      <div className="basketball-loader" />
    </div>
  );
  if (!game) return <div className="flex items-center justify-center min-h-screen bg-black text-gray-500 uppercase tracking-[2px] text-[0.85rem]">Game not found.</div>;

  const won = game.patriotsScore > game.opponentScore;

  return (
    <div>
      <section className="bg-black py-24 px-4 md:px-8 border-b border-white/[0.04] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none" style={{ background: won ? 'rgba(227,27,35,0.06)' : 'rgba(255,255,255,0.02)' }} />

        <div className="max-w-[900px] mx-auto relative z-10">
          <Link to="/games" className="animated-link inline-flex items-center gap-1.5 text-gray-500 text-[0.65rem] font-bold uppercase tracking-[2px] hover:text-white transition-colors mb-8 no-underline">
            <ArrowLeft size={13} strokeWidth={2} /> All Games
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-[0.6rem] font-bold uppercase tracking-[3px] text-gray-600 bg-white/[0.04] px-2.5 py-1 rounded-sm">{game.season}</span>
            {game.competition && <span className="text-[0.6rem] font-bold uppercase tracking-[3px] text-gray-600 bg-white/[0.04] px-2.5 py-1 rounded-sm">{game.competition}</span>}
          </div>

          <div className="text-center py-10">
            <div className="text-gray-600 text-[0.65rem] font-bold uppercase tracking-[3px] mb-8 flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${won ? "bg-red animate-[glowPulse_2s_ease-in-out_infinite]" : "bg-gray-600"}`} />
              {game.home ? "Home Game" : "Away Game"}
            </div>
            <div className="flex items-center justify-center gap-6 md:gap-12">
              <div className="text-right flex-1">
                <div className="font-heading text-[clamp(1.5rem,4vw,3rem)] tracking-[3px] uppercase text-white">Patriots</div>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="font-heading text-[clamp(3rem,9vw,7rem)] leading-none text-red score-flash drop-shadow-[0_0_20px_rgba(227,27,35,0.3)]">{game.patriotsScore}</span>
                <span className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] text-gray-700">—</span>
                <span className="font-heading text-[clamp(3rem,9vw,7rem)] leading-none text-white/80">{game.opponentScore}</span>
              </div>
              <div className="text-left flex-1">
                <div className="font-heading text-[clamp(1.5rem,4vw,3rem)] tracking-[3px] uppercase text-white">{game.opponent}</div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 mt-8 text-[0.65rem] font-bold uppercase tracking-[3px] px-5 py-2.5 ${won ? "badge-win" : "badge-loss"}`}>
              {won && <Trophy size={12} strokeWidth={2} />}
              {won ? "Victory" : "Defeat"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-[2px] mt-8">
            {[
              { icon: MapPin, label: "Venue", value: game.venue || "TBD" },
              { icon: Calendar, label: "Date", value: new Date(game.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) },
              { icon: Clock, label: "Time", value: game.time || "TBD" },
            ].map(({ icon: Icon, label, value }, i) => (
              <div key={label} className="bg-black-card p-5 text-center group hover:bg-black-elevated transition-all duration-300 card-enter" style={{ animationDelay: `${i * 0.1}s` }}>
                <Icon size={14} strokeWidth={1.5} className="text-red mx-auto mb-2" />
                <div className="text-gray-600 text-[0.55rem] font-bold uppercase tracking-[3px] mb-1">{label}</div>
                <div className="text-white text-[0.8rem] font-medium">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Performers */}
      {game.bestPerformers && game.bestPerformers.length > 0 && (
        <section className="bg-black py-14 px-4 md:px-8">
          <div className="max-w-[900px] mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Trophy size={16} strokeWidth={1.5} className="text-red" />
              <h2 className="font-heading text-[1.2rem] tracking-[3px] uppercase text-white">Best Performers</h2>
            </div>
            <div className="grid grid-cols-3 gap-[2px]">
              {game.bestPerformers.map((perf, i) => (
                <div key={i} className="bg-black-card p-6 text-center group hover:bg-black-elevated transition-all duration-300 card-enter" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="font-heading text-[0.75rem] tracking-[3px] text-gray-600 uppercase mb-3">{perf.stat}</div>
                  <div className="font-heading text-[1.8rem] text-red group-hover:scale-110 transition-transform duration-300">{perf.value}</div>
                  <div className="text-white text-[0.8rem] mt-2">{perf.playerName}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Box Score */}
      {game.boxScore && Object.keys(game.boxScore).length > 0 && (
        <section className="bg-black py-14 px-4 md:px-8">
          <div className="max-w-[900px] mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Users size={16} strokeWidth={1.5} className="text-red" />
              <h2 className="font-heading text-[1.2rem] tracking-[3px] uppercase text-white">Box Score</h2>
            </div>
            <div className="overflow-x-auto rounded-sm border border-white/[0.04]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    {["Player", "PTS", "REB", "AST", "STL", "BLK"].map((h) => (
                      <th key={h} className="py-3.5 px-4 text-[0.6rem] font-bold uppercase tracking-[2px] text-gray-600 bg-black-card">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(game.boxScore).map(([name, stats]) => (
                    <tr key={name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-300">
                      <td className="py-3.5 px-4 text-white text-[0.8rem] font-medium">{name}</td>
                      <td className="py-3.5 px-4 text-red font-heading text-[0.95rem]">{stats.points || 0}</td>
                      <td className="py-3.5 px-4 text-gray-400 text-[0.8rem]">{stats.rebounds || 0}</td>
                      <td className="py-3.5 px-4 text-gray-400 text-[0.8rem]">{stats.assists || 0}</td>
                      <td className="py-3.5 px-4 text-gray-400 text-[0.8rem]">{stats.steals || 0}</td>
                      <td className="py-3.5 px-4 text-gray-400 text-[0.8rem]">{stats.blocks || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
