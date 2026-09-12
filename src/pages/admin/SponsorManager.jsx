import { useState, useEffect } from "react";
import { sponsorAPI, uploadAPI } from "../../services/api";
import { ArrowLeft, Upload, Loader2, Pencil, Trash2, Handshake } from "lucide-react";

export default function SponsorManager() {
  const [sponsors, setSponsors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", logo: "", website: "", description: "", level: "Official Partner", order: 0, status: "active" });

  useEffect(() => { loadSponsors(); }, []);
  const loadSponsors = () => { sponsorAPI.getAllAdmin().then((res) => setSponsors(res.data)); };

  const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try { const res = await uploadAPI.single(fd); setForm((prev) => ({ ...prev, logo: res.data.url })); }
    catch { alert("Upload failed"); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editingId ? await sponsorAPI.update(editingId, form) : await sponsorAPI.create(form);
      resetForm(); loadSponsors();
    } catch (err) { alert(err.response?.data?.message || "Save failed"); }
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, logo: s.logo || "", website: s.website || "", description: s.description || "", level: s.level, order: s.order || 0, status: s.status });
    setEditingId(s._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sponsor?")) return;
    await sponsorAPI.delete(id); loadSponsors();
  };

  const resetForm = () => { setForm({ name: "", logo: "", website: "", description: "", level: "Official Partner", order: 0, status: "active" }); setEditingId(null); };

  const inputClass = "w-full py-2.5 px-3.5 bg-white/[0.03] border border-white/[0.08] rounded-md text-white text-[0.85rem] placeholder:text-gray-600 focus:outline-none focus:border-red/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass = "block mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-gray-500";

  return (
    <div>
      <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 text-[0.8rem] hover:text-white transition-colors mb-6">
        <ArrowLeft size={14} /> Back
      </button>
      <h1 className="font-heading text-[2.2rem] tracking-[2px] uppercase text-white leading-none mb-8">Sponsor Manager</h1>

      {/* Form */}
      <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-6 mb-6">
        <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">{editingId ? "Edit Sponsor" : "Add Sponsor"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4"><label className={labelClass}>Name</label><input name="name" value={form.name} onChange={handleChange} required className={inputClass} /></div>
          <div className="mb-4">
            <label className={labelClass}>Logo</label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/[0.08] rounded-lg cursor-pointer hover:border-red/30 hover:bg-white/[0.02] transition-all duration-200">
              {uploading ? <div className="flex items-center gap-2 text-gray-500"><Loader2 size={16} className="animate-spin" /></div>
                : form.logo ? <img src={form.logo} alt="Logo" className="h-full object-contain" />
                : <div className="flex flex-col items-center gap-2 text-gray-600"><Upload size={18} /><span className="text-[0.7rem]">Upload logo</span></div>}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Website</label><input name="website" value={form.website} onChange={handleChange} placeholder="https://" className={inputClass} /></div>
            <div><label className={labelClass}>Level</label>
              <select name="level" value={form.level} onChange={handleChange} className={inputClass}>
                <option value="Title Partner">Title Partner</option><option value="Main Partner">Main Partner</option><option value="Official Partner">Official Partner</option><option value="Media Partner">Media Partner</option><option value="Community Partner">Community Partner</option>
              </select>
            </div>
          </div>
          <div className="mb-4"><label className={labelClass}>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} /></div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div><label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
            <div><label className={labelClass}>Order</label><input name="order" type="number" value={form.order} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] rounded-md hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.25)] transition-all duration-300">
              {editingId ? "Update" : "Add Sponsor"}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-white/[0.04] text-gray-400 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-md border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300">Sponsors ({sponsors.length})</h2>
      </div>
      {sponsors.length === 0 ? (
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-12 text-center">
          <Handshake size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-600 text-[0.85rem]">No sponsors yet.</p>
        </div>
      ) : (
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead><tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500">Logo</th>
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500">Name</th>
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500">Level</th>
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500">Status</th>
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {sponsors.map((s) => (
                <tr key={s._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">{s.logo ? <img src={s.logo} alt={s.name} className="h-7 object-contain" /> : <span className="text-gray-600 text-[0.8rem]">—</span>}</td>
                  <td className="px-5 py-3 text-[0.85rem] font-medium">{s.name}</td>
                  <td className="px-5 py-3"><span className="text-[0.7rem] font-bold uppercase tracking-[1px] text-red">{s.level}</span></td>
                  <td className="px-5 py-3"><span className={`text-[0.65rem] font-semibold uppercase tracking-[1px] px-2 py-0.5 rounded ${s.status === "active" ? "bg-green-500/10 text-green-500" : "bg-white/[0.04] text-gray-500"}`}>{s.status}</span></td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => handleEdit(s)} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold rounded border border-white/[0.06] hover:text-white hover:bg-white/[0.08] transition-all duration-150"><Pencil size={10} /></button>
                      <button onClick={() => handleDelete(s._id)} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold rounded border border-white/[0.06] hover:text-red hover:bg-red/10 transition-all duration-150"><Trash2 size={10} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
