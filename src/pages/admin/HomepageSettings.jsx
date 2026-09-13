import { useState, useEffect } from "react";
import { homepageAPI } from "../../services/api";
import { ArrowLeft, Plus, Trash2, Loader2, Check } from "lucide-react";

export default function HomepageSettings() {
  const [form, setForm] = useState({
    hero: { backgroundImage: "", title: "PATRIOTS BBC", subtitle: "BUILT TO COMPETE. BORN TO WIN.", description: "Kigali's basketball pride.", primaryButtonText: "MEET THE TEAM", primaryButtonUrl: "/team", secondaryButtonText: "UPCOMING GAME", secondaryButtonUrl: "/games", active: true },
    statistics: [],
    socialLinks: { instagram: "", facebook: "", twitter: "", youtube: "", tiktok: "" },
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    homepageAPI.get().then((res) => {
      if (res.data) setForm((prev) => ({ ...prev, hero: res.data.hero || prev.hero, statistics: res.data.statistics || [], socialLinks: res.data.socialLinks || prev.socialLinks }));
      setLoading(false);
    });
  }, []);

  const handleHeroChange = (e) => { const { name, value, type, checked } = e.target; setForm((prev) => ({ ...prev, hero: { ...prev.hero, [name]: type === "checkbox" ? checked : value } })); };
  const handleSocialChange = (e) => { setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [e.target.name]: e.target.value } })); };
  const addStat = () => { setForm((prev) => ({ ...prev, statistics: [...prev.statistics, { value: "", label: "", order: prev.statistics.length, active: true }] })); };
  const updateStat = (i, field, value) => { setForm((prev) => { const s = [...prev.statistics]; s[i] = { ...s[i], [field]: value }; return { ...prev, statistics: s }; }); };
  const removeStat = (i) => { setForm((prev) => ({ ...prev, statistics: prev.statistics.filter((_, idx) => idx !== i) })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await homepageAPI.update(form); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    catch (err) { alert(err.response?.data?.message || "Save failed"); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><Loader2 size={24} className="text-red animate-spin" /></div>;

  const inputClass = "w-full py-2.5 px-3.5 bg-white/[0.03] border border-white/[0.08] rounded-md text-white text-[0.85rem] placeholder:text-gray-600 focus:outline-none focus:border-red/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass = "block mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-gray-500";
  const card = "bg-black-card border border-white/[0.06] rounded-lg p-6 mb-4";

  return (
    <div>
      <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 text-[0.8rem] hover:text-white transition-colors mb-6"><ArrowLeft size={14} /> Back</button>
      <h1 className="font-heading text-[2.2rem] tracking-[2px] uppercase text-white leading-none mb-8">Homepage Settings</h1>

      {saved && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-md mb-6 text-[0.85rem] font-medium">
          <Check size={16} /> Homepage settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Hero */}
        <div className={card}>
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Hero Section</h2>
          <div className="mb-4"><label className={labelClass}>Background Image URL</label><input name="backgroundImage" value={form.hero.backgroundImage} onChange={handleHeroChange} className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Title</label><input name="title" value={form.hero.title} onChange={handleHeroChange} className={inputClass} /></div>
            <div><label className={labelClass}>Subtitle</label><input name="subtitle" value={form.hero.subtitle} onChange={handleHeroChange} className={inputClass} /></div>
          </div>
          <div className="mb-4"><label className={labelClass}>Description</label><input name="description" value={form.hero.description} onChange={handleHeroChange} className={inputClass} /></div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><label className={labelClass}>Primary Button Text</label><input name="primaryButtonText" value={form.hero.primaryButtonText} onChange={handleHeroChange} className={inputClass} /></div>
            <div><label className={labelClass}>Primary Button URL</label><input name="primaryButtonUrl" value={form.hero.primaryButtonUrl} onChange={handleHeroChange} className={inputClass} /></div>
            <div><label className={labelClass}>Secondary Button Text</label><input name="secondaryButtonText" value={form.hero.secondaryButtonText} onChange={handleHeroChange} className={inputClass} /></div>
          </div>
          <div className="mb-4"><label className={labelClass}>Secondary Button URL</label><input name="secondaryButtonUrl" value={form.hero.secondaryButtonUrl} onChange={handleHeroChange} className={inputClass} /></div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" name="active" checked={form.hero.active} onChange={handleHeroChange} className="w-4 h-4 accent-red" />
            <span className="text-[0.8rem] text-gray-400 font-medium">Active</span>
          </label>
        </div>

        {/* Statistics */}
        <div className={card}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300">Statistics</h2>
            <button type="button" onClick={addStat} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold uppercase tracking-[1px] rounded border border-white/[0.06] hover:text-white hover:bg-white/[0.08] transition-all duration-150">
              <Plus size={12} /> Add Stat
            </button>
          </div>
          {form.statistics.length === 0 ? (
            <p className="text-gray-600 text-[0.8rem]">No statistics added.</p>
          ) : (
            <div className="space-y-3">
              {form.statistics.map((stat, i) => (
                <div key={i} className="grid grid-cols-[100px_1fr_60px_36px] gap-3 items-center">
                  <input value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} placeholder="Value" className="py-2 px-3 bg-white/[0.03] border border-white/[0.08] rounded-md text-white text-[0.85rem] focus:outline-none focus:border-red/40 transition-all" />
                  <input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Label" className="py-2 px-3 bg-white/[0.03] border border-white/[0.08] rounded-md text-white text-[0.85rem] focus:outline-none focus:border-red/40 transition-all" />
                  <input type="number" value={stat.order} onChange={(e) => updateStat(i, "order", Number(e.target.value))} className="py-2 px-3 bg-white/[0.03] border border-white/[0.08] rounded-md text-white text-[0.85rem] focus:outline-none focus:border-red/40 transition-all text-center" />
                  <button type="button" onClick={() => removeStat(i)} className="w-9 h-9 flex items-center justify-center bg-white/[0.04] border border-white/[0.06] rounded-md text-gray-400 hover:text-red hover:bg-red/10 transition-all duration-150">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Social */}
        <div className={card}>
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Social Links</h2>
          <div className="grid grid-cols-2 gap-4">
            {["instagram", "facebook", "twitter", "youtube", "tiktok"].map((p) => (
              <div key={p}><label className={labelClass} style={{ textTransform: "capitalize" }}>{p}</label>
                <input name={p} value={form.socialLinks[p]} onChange={handleSocialChange} placeholder={`https://${p}.com/...`} className={inputClass} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="px-6 py-2.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] rounded-md hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.25)] transition-all duration-300">
          Save Homepage Settings
        </button>
      </form>
    </div>
  );
}
