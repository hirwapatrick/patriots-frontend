import { useState, useEffect } from "react";
import { sponsorAPI } from "../services/api";
import { Loader2, ExternalLink, Handshake, Star, Award, Trophy } from "lucide-react";

const tierIcons = {
  platinum: Trophy,
  gold: Award,
  silver: Star,
  bronze: Handshake,
};

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sponsorAPI.getAll().then((res) => { setSponsors(res.data); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
      <div className="basketball-loader" />
      <span className="text-[0.65rem] uppercase tracking-[4px] text-gray-500 font-bold">Loading Sponsors</span>
    </div>
  );

  return (
    <div>
      <section className="page-hero page-hero-compact">
        <span className="inline-block font-heading text-[0.85rem] tracking-[6px] text-red mb-1 uppercase page-hero-subtitle">Partners</span>
        <h1 className="font-heading text-[clamp(3rem,8vw,6rem)] uppercase tracking-[3px] leading-[0.9] page-hero-title">Sponsors</h1>
        <p className="text-gray-400 mt-4 font-light page-hero-subtitle">The brands that power Patriots BBC.</p>
      </section>

      <section className="bg-[#050505] text-white py-20 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          {sponsors.length === 0 ? (
            <div className="py-20 text-center">
              <Handshake size={48} strokeWidth={1} className="text-white/10 mx-auto mb-4" />
              <p className="text-gray-600 text-[0.85rem] uppercase tracking-[2px]">No sponsors to display yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[2px]">
              {sponsors.map((sponsor, i) => {
                const TierIcon = tierIcons[sponsor.tier?.toLowerCase()] || Handshake;
                return (
                  <a key={sponsor._id} href={sponsor.website || "#"} target="_blank" rel="noopener noreferrer"
                    className="group bg-[#0a0a0a] text-white p-9 text-center transition-all duration-500 block no-underline glow-card card-enter relative overflow-hidden"
                    style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    {sponsor.logo ? (
                      <div className="h-[55px] flex items-center justify-center mb-5">
                        <img src={sponsor.logo} alt={sponsor.name} className="h-[55px] w-auto object-contain opacity-50 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(227,27,35,0.3)] transition-all duration-500" />
                      </div>
                    ) : (
                      <div className="font-heading text-[1.8rem] tracking-[2px] mb-5 opacity-50 group-hover:opacity-100 transition-opacity">{sponsor.name}</div>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      {sponsor.tier && (
                        <span className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[3px] text-gray-500 group-hover:text-red transition-colors duration-300">
                          <TierIcon size={10} strokeWidth={1.5} />
                          {sponsor.tier} Partner
                        </span>
                      )}
                      {sponsor.website && <ExternalLink size={10} strokeWidth={1.5} className="text-gray-700 group-hover:text-red group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />}
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
