import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { homepageAPI, achievementAPI, staffAPI } from "../services/api";
import { Loader2, Mail, ChevronRight, Trophy } from "lucide-react";

export default function Club() {
  const [homepage, setHomepage] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      homepageAPI.get().catch(() => ({ data: null })),
      achievementAPI.getAll().catch(() => ({ data: [] })),
      staffAPI.getAll({}).catch(() => ({ data: [] })),
    ]).then(([hp, ach, st]) => {
      setHomepage(hp.data);
      setAchievements(ach.data);
      setStaff(st.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
      <div className="basketball-loader" />
      <span className="text-[0.65rem] uppercase tracking-[4px] text-gray-500 font-bold">Loading</span>
    </div>
  );

  const story = homepage?.clubStory;

  return (
    <div>
      <section className="page-hero">
        <span className="inline-block font-heading text-[0.85rem] tracking-[6px] text-red mb-1 uppercase page-hero-subtitle">About</span>
        <h1 className="font-heading text-[clamp(3rem,8vw,6rem)] uppercase tracking-[3px] leading-[0.9] page-hero-title">Our Club</h1>
      </section>

      {story && (
        <section className="bg-[#050505] text-white py-24 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-red/[0.02] rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-[1200px] mx-auto grid grid-cols-[1fr_1fr] gap-16 items-center max-md:grid-cols-1 relative z-10">
            <div className="reveal">
              <div className="w-[12px] h-[12px] bg-red mb-6 relative">
                <div className="absolute inset-0 bg-red animate-[glowPulse_3s_ease-in-out_infinite]" />
              </div>
              <span className="inline-flex items-center gap-2 font-heading text-[0.75rem] tracking-[5px] text-red mb-3 uppercase">
                <span className="w-6 h-[1px] bg-red" />
                Our Story
              </span>
              <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] tracking-[2px] uppercase leading-[0.95] mb-8">{story.title || "Who We Are"}</h2>
              <p className="text-gray-400 leading-[1.9] font-light whitespace-pre-wrap text-[0.95rem]">{story.content}</p>
            </div>
            {story.image && (
              <div className="overflow-hidden reveal reveal-delay-2 relative">
                <img src={story.image} alt="" className="w-full h-full object-cover relative z-10" />
                <div className="absolute -bottom-4 -right-4 w-full h-full border border-red/20 z-0" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="bg-black text-white py-24 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-heading text-[0.75rem] tracking-[5px] text-red mb-3 uppercase justify-center">
              <span className="w-6 h-[1px] bg-red" />
              Timeline
              <span className="w-6 h-[1px] bg-red" />
            </span>
            <h2 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-normal uppercase leading-[0.92] tracking-[1px]">Our History</h2>
          </div>
          {achievements.length > 0 ? (
            <div className="timeline">
              {achievements.map((ach, i) => (
                <div key={ach._id} className="timeline-item reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="timeline-dot" />
                  <div>
                    <div className="font-heading text-[3.5rem] text-red leading-none tracking-[2px]">{ach.year}</div>
                    <div className="font-heading text-[1.2rem] tracking-[2px] uppercase mt-2">{ach.title}</div>
                    {ach.description && <div className="text-[0.85rem] text-gray-400 mt-2 leading-relaxed">{ach.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-10 text-[0.85rem] uppercase tracking-[2px]">No achievements listed yet.</div>
          )}
        </div>
      </section>

      {/* Staff */}
      {staff.length > 0 && (
        <section className="bg-[#050505] text-white py-24 px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 font-heading text-[0.75rem] tracking-[5px] text-red mb-3 uppercase justify-center">
                <span className="w-6 h-[1px] bg-red" />
                Staff
                <span className="w-6 h-[1px] bg-red" />
              </span>
              <h2 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-normal uppercase leading-[0.92] tracking-[1px]">Behind The Scenes</h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[2px]">
              {staff.map((s, i) => (
                <div key={s._id} className="bg-[#0a0a0a] text-white p-7 text-center group hover:bg-[#0f0f0f] transition-all duration-500 card-enter relative overflow-hidden" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                  {s.photo && (
                    <div className="relative mx-auto mb-4 w-[90px] h-[90px]">
                      <img src={s.photo} alt={`${s.firstName} ${s.lastName}`} className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 rounded-full border-2 border-red/0 group-hover:border-red/30 transition-all duration-500" />
                    </div>
                  )}
                  <div className="font-heading text-[1.1rem] tracking-[2px] uppercase">{s.firstName} {s.lastName}</div>
                  <div className="text-[0.7rem] text-red font-bold uppercase tracking-[2px] mt-1.5">{s.role}</div>
                  {s.email && (
                    <a href={`mailto:${s.email}`} className="inline-flex items-center gap-1.5 text-gray-500 text-[0.75rem] mt-4 hover:text-white transition-all no-underline">
                      <Mail size={11} strokeWidth={1.5} />
                      {s.email}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-red text-white py-24 px-6 md:px-8 text-center relative overflow-hidden section-red-clip">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="relative z-10">
          <div className="font-heading text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] uppercase tracking-[3px] mb-8">Join<br />The Family</div>
          <p className="mb-10 text-white/80 max-w-[400px] mx-auto font-light text-[1rem] leading-relaxed">Be part of Kigali&apos;s basketball story.</p>
          <Link to="/contact" className="btn-ripple inline-flex items-center gap-2 px-9 py-4 bg-white text-black text-[0.72rem] font-bold uppercase tracking-[2px] hover:bg-gray-100 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(255,255,255,0.2)] transition-all duration-300 no-underline relative overflow-hidden">
            Contact Us <ChevronRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  );
}
