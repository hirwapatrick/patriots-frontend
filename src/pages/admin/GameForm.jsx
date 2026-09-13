import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gameAPI, competitionAPI, uploadAPI } from "../../services/api";
import { ArrowLeft, Upload, Loader2, Star } from "lucide-react";

export default function GameForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [uploading, setUploading] = useState({ home: false, away: false });
  const [form, setForm] = useState({
    homeTeam: "Patriots BBC", awayTeam: "", homeScore: "", awayScore: "",
    date: "", time: "", venue: "", competition: "", season: "",
    homeLogo: "", awayLogo: "", ticketInfo: "", status: "upcoming",
    matchReport: "", highlights: "", isFeatured: false,
  });

  useEffect(() => {
    competitionAPI.getAll().then((res) => setCompetitions(res.data)).catch(() => {});
    if (isEdit) {
      gameAPI.getById(id).then((res) => {
        const g = res.data;
        setForm({ ...g, date: g.date ? g.date.split("T")[0] : "", competition: g.competition?._id || "", homeScore: g.homeScore ?? "", awayScore: g.awayScore ?? "" });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleLogoUpload = async (e, team) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading((prev) => ({ ...prev, [team]: true }));
    const fd = new FormData();
    fd.append("file", file);
    try { const res = await uploadAPI.single(fd); setForm((prev) => ({ ...prev, [`${team}Logo`]: res.data.url })); }
    catch { alert("Upload failed"); } finally { setUploading((prev) => ({ ...prev, [team]: false })); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.homeScore === "") payload.homeScore = null;
    if (payload.awayScore === "") payload.awayScore = null;
    try {
      isEdit ? await gameAPI.update(id, payload) : await gameAPI.create(payload);
      navigate("/admin/dashboard");
    } catch (err) { alert(err.response?.data?.message || "Save failed"); }
  };

  const inputClass = "w-full py-2.5 px-3.5 bg-white/[0.03] border border-white/[0.08] rounded-md text-white text-[0.85rem] placeholder:text-gray-600 focus:outline-none focus:border-red/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass = "block mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-gray-500";

  return (
    <div>
      <button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-2 text-gray-500 text-[0.8rem] hover:text-white transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Dashboard
      </button>
      <h1 className="font-heading text-[2.2rem] tracking-[2px] uppercase text-white leading-none mb-8">
        {isEdit ? "Edit Game" : "Add Game"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-[900px]">
        {/* Teams */}
        <div className="bg-black-card border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Teams</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Home Team</label><input name="homeTeam" value={form.homeTeam} onChange={handleChange} required className={inputClass} /></div>
            <div><label className={labelClass}>Away Team</label><input name="awayTeam" value={form.awayTeam} onChange={handleChange} required className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{ team: "home", label: "Home Logo" }, { team: "away", label: "Away Logo" }].map(({ team, label }) => (
              <div key={team}>
                <label className={labelClass}>{label}</label>
                <label className="flex items-center justify-center h-24 border-2 border-dashed border-white/[0.08] rounded-lg cursor-pointer hover:border-red/30 hover:bg-white/[0.02] transition-all duration-200">
                  {uploading[team] ? (
                    <div className="flex items-center gap-2 text-gray-500"><Loader2 size={16} className="animate-spin" /></div>
                  ) : form[`${team}Logo`] ? (
                    <img src={form[`${team}Logo`]} alt="" className="h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-600"><Upload size={16} /><span className="text-[0.65rem]">Upload logo</span></div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, team)} className="hidden" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-black-card border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Schedule</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><label className={labelClass}>Date</label><input name="date" type="date" value={form.date} onChange={handleChange} required className={inputClass} /></div>
            <div><label className={labelClass}>Time</label><input name="time" value={form.time} onChange={handleChange} placeholder="e.g. 19:00" className={inputClass} /></div>
            <div><label className={labelClass}>Venue</label><input name="venue" value={form.venue} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Competition</label>
              <select name="competition" value={form.competition} onChange={handleChange} className={inputClass}>
                <option value="">Select competition</option>
                {competitions.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Season</label><input name="season" value={form.season} onChange={handleChange} placeholder="e.g. 2024-2025" className={inputClass} /></div>
          </div>
        </div>

        {/* Status & Score */}
        <div className="bg-black-card border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Status & Score</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="final">Final</option><option value="postponed">Postponed</option><option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div><label className={labelClass}>Home Score</label><input name="homeScore" type="number" value={form.homeScore} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Away Score</label><input name="awayScore" type="number" value={form.awayScore} onChange={handleChange} className={inputClass} /></div>
          </div>
        </div>

        {/* Extras */}
        <div className="bg-black-card border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Ticket Info</label><input name="ticketInfo" value={form.ticketInfo} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Highlights URL</label><input name="highlights" value={form.highlights} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Match Report (HTML)</label><textarea name="matchReport" value={form.matchReport} onChange={handleChange} rows={6} className={`${inputClass} resize-none`} /></div>
          <label className="flex items-center gap-2.5 mt-4 cursor-pointer">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-red" />
            <Star size={14} className="text-gray-500" />
            <span className="text-[0.8rem] text-gray-400 font-medium">Featured Game</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] rounded-md hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.25)] transition-all duration-300">
            {isEdit ? "Update Game" : "Create Game"}
          </button>
          <button type="button" onClick={() => navigate("/admin/dashboard")} className="px-6 py-2.5 bg-white/[0.04] text-gray-400 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-md border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
