import { useState, useEffect } from "react";
import { settingsAPI } from "../../services/api";
import { ArrowLeft, Loader2, Check } from "lucide-react";

export default function SiteSettingsPage() {
  const [form, setForm] = useState({
    siteName: "Patriots BBC", tagline: "Kigali's Basketball Pride",
    logo: "", favicon: "", contactEmail: "", contactPhone: "",
    address: "", locationUrl: "",
    socialLinks: { instagram: "", facebook: "", twitter: "", youtube: "", tiktok: "" },
    metaTitle: "", metaDescription: "", ogImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsAPI.get().then((res) => {
      if (res.data) setForm((prev) => ({ ...res.data, socialLinks: res.data.socialLinks || prev.socialLinks }));
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await settingsAPI.update(form); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    catch (err) { alert(err.response?.data?.message || "Save failed"); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><Loader2 size={24} className="text-red animate-spin" /></div>;

  const inputClass = "w-full py-2.5 px-3.5 bg-white/[0.03] border border-white/[0.08] rounded-md text-white text-[0.85rem] placeholder:text-gray-600 focus:outline-none focus:border-red/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass = "block mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-gray-500";
  const card = "bg-black-card border border-white/[0.06] rounded-lg p-6 mb-4";

  return (
    <div>
      <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 text-[0.8rem] hover:text-white transition-colors mb-6"><ArrowLeft size={14} /> Back</button>
      <h1 className="font-heading text-[2.2rem] tracking-[2px] uppercase text-white leading-none mb-8">Site Settings</h1>

      {saved && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-md mb-6 text-[0.85rem] font-medium">
          <Check size={16} /> Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* General */}
        <div className={card}>
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">General</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Site Name</label><input name="siteName" value={form.siteName} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Tagline</label><input name="tagline" value={form.tagline} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Logo URL</label><input name="logo" value={form.logo} onChange={handleChange} className={inputClass} /></div>
        </div>

        {/* Contact */}
        <div className={card}>
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Contact</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Email</label><input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Phone</label><input name="contactPhone" value={form.contactPhone} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="mb-4"><label className={labelClass}>Address</label><input name="address" value={form.address} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Location URL (Google Maps)</label><input name="locationUrl" value={form.locationUrl} onChange={handleChange} className={inputClass} /></div>
        </div>

        {/* Social */}
        <div className={card}>
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Social Media</h2>
          <div className="grid grid-cols-2 gap-4">
            {["instagram", "facebook", "twitter", "youtube", "tiktok"].map((p) => (
              <div key={p}><label className={labelClass} style={{ textTransform: "capitalize" }}>{p}</label>
                <input name={`socialLinks.${p}`} value={form.socialLinks[p]} onChange={handleChange} placeholder={`https://${p}.com/...`} className={inputClass} />
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className={card}>
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">SEO</h2>
          <div className="mb-4"><label className={labelClass}>Meta Title</label><input name="metaTitle" value={form.metaTitle} onChange={handleChange} className={inputClass} /></div>
          <div className="mb-4"><label className={labelClass}>Meta Description</label><textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} /></div>
          <div><label className={labelClass}>OG Image URL</label><input name="ogImage" value={form.ogImage} onChange={handleChange} className={inputClass} /></div>
        </div>

        <button type="submit" className="px-6 py-2.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] rounded-md hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.25)] transition-all duration-300">
          Save Settings
        </button>
      </form>
    </div>
  );
}
