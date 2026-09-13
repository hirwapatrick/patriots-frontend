import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { playerAPI } from "../services/api";
import { Loader2, ArrowLeft, Ruler, Weight, Calendar, Shield } from "lucide-react";

export default function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playerAPI.getById(id).then((res) => { setPlayer(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
      <div className="basketball-loader" />
    </div>
  );
  if (!player) return <div className="flex items-center justify-center min-h-screen bg-black text-gray-500 uppercase tracking-[2px] text-[0.85rem]">Player not found.</div>;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-black min-h-[75vh] flex items-end overflow-hidden">
        {player.photo && <img src={player.photo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105 animate-[scaleIn_1.2s_cubic-bezier(0.16,1,0.3,1)_both]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        {/* Large jersey number background */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 font-heading text-[20rem] leading-none text-white/[0.02] select-none pointer-events-none">{player.jerseyNumber}</div>

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 md:px-8 pb-20 pt-32">
          <Link to="/team" className="animated-link inline-flex items-center gap-1.5 text-gray-500 text-[0.65rem] font-bold uppercase tracking-[2px] hover:text-white transition-colors mb-8 no-underline">
            <ArrowLeft size={13} strokeWidth={2} /> All Players
          </Link>
          <div className="flex items-end gap-8">
            <div className="font-heading text-[clamp(5rem,14vw,12rem)] leading-none text-red tracking-[3px] animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_both] drop-shadow-[0_0_30px_rgba(227,27,35,0.3)]">{player.jerseyNumber}</div>
            <div className="animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]">
              <h1 className="font-heading text-[clamp(2rem,5vw,4rem)] uppercase tracking-[2px] leading-[0.9] text-white">{player.firstName}<br />{player.lastName}</h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-red rounded-full" />
                <div className="text-gray-400 text-[0.75rem] font-bold uppercase tracking-[3px]">{player.position}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="bg-black py-12 px-4 md:px-8 border-b border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-[2px]">
          {[
            { icon: Ruler, label: "Height", value: player.height || "—" },
            { icon: Weight, label: "Weight", value: player.weight ? `${player.weight} kg` : "—" },
            { icon: Calendar, label: "Born", value: player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—" },
            { icon: Shield, label: "Number", value: `#${player.jerseyNumber}` },
          ].map(({ icon: Icon, label, value }, i) => (
            <div key={label} className="bg-black-card p-6 text-center group hover:bg-black-elevated transition-all duration-500 card-enter" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-10 h-10 bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3 group-hover:bg-red/10 group-hover:border-red/20 transition-all duration-300">
                <Icon size={16} strokeWidth={1.5} className="text-red" />
              </div>
              <div className="text-gray-500 text-[0.6rem] font-bold uppercase tracking-[3px] mb-1">{label}</div>
              <div className="font-heading text-[1.3rem] tracking-[1px] text-white">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bio */}
      {player.bio && (
        <section className="bg-black py-16 px-4 md:px-8">
          <div className="max-w-[800px] mx-auto">
            <span className="inline-flex items-center gap-2 font-heading text-[0.75rem] tracking-[5px] text-red mb-4 uppercase">
              <span className="w-6 h-[1px] bg-red" />
              About
            </span>
            <p className="text-gray-400 leading-[1.9] font-light text-[0.95rem]">{player.bio}</p>
          </div>
        </section>
      )}
    </div>
  );
}
