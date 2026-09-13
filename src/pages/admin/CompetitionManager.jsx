import { useState, useEffect } from "react";
import { competitionAPI } from "../../services/api";
import { ArrowLeft, Pencil, Trash2, Award } from "lucide-react";

export default function CompetitionManager() {
  const [competitions, setCompetitions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", logo: "", description: "", season: "", status: "active" });

  useEffect(() => { loadCompetitions(); }, []);
  const loadCompetitions = () => { competitionAPI.getAllAdmin().then((res) => setCompetitions(res.data)); };

  const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };
  const handleSlug = (e) => { const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); setForm((prev) => ({ ...prev, name: e.target.value, slug })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editingId ? await competitionAPI.update(editingId, form) : await competitionAPI.create(form);
      resetForm(); loadCompetitions();
    } catch (err) { alert(err.response?.data?.message || "Save failed"); }
  };

  const handleEdit = (c) => { setForm({ name: c.name, slug: c.slug, logo: c.logo || "", description: c.description || "", season: c.season || "", status: c.status }); setEditingId(c._id); };
  const handleDelete = async (id) => { if (!window.confirm("Delete this competition?")) return; await competitionAPI.delete(id); loadCompetitions(); };
  const resetForm = () => { setForm({ name: "", slug: "", logo: "", description: "", season: "", status: "active" }); setEditingId(null); };

  const inputClass = "w-full py-2.5 px-3.5 bg-white/[0.03] border border-white/[0.08] rounded-md text-white text-[0.85rem] placeholder:text-gray-600 focus:outline-none focus:border-red/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass = "block mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-gray-500";

  return (
    <div>
      <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 text-[0.8rem] hover:text-white transition-colors mb-6">
        <ArrowLeft size={14} /> Back
      </button>
      <h1 className="font-heading text-[2.2rem] tracking-[2px] uppercase text-white leading-none mb-8">Competition Manager</h1>

      <div className="bg-black-card border border-white/[0.06] rounded-lg p-6 mb-6">
        <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">{editingId ? "Edit Competition" : "Add Competition"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Name</label><input name="name" value={form.name} onChange={handleSlug} required className={inputClass} /></div>
            <div><label className={labelClass}>Slug</label><input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} /></div>
          </div>
          <div className="mb-4"><label className={labelClass}>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} /></div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div><label className={labelClass}>Season</label><input name="season" value={form.season} onChange={handleChange} placeholder="e.g. 2024-2025" className={inputClass} /></div>
            <div><label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] rounded-md hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.25)] transition-all duration-300">
              {editingId ? "Update" : "Add Competition"}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-white/[0.04] text-gray-400 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-md border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300">Competitions ({competitions.length})</h2>
      </div>
      {competitions.length === 0 ? (
        <div className="bg-black-card border border-white/[0.06] rounded-lg p-12 text-center">
          <Award size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-600 text-[0.85rem]">No competitions yet.</p>
        </div>
      ) : (
        <div className="bg-black-card border border-white/[0.06] rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead><tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500">Name</th>
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500">Season</th>
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500">Status</th>
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {competitions.map((c) => (
                <tr key={c._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-[0.85rem] font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-[0.8rem] text-gray-400">{c.season || "—"}</td>
                  <td className="px-5 py-3"><span className={`text-[0.65rem] font-semibold uppercase tracking-[1px] px-2 py-0.5 rounded ${c.status === "active" ? "bg-green-500/10 text-green-500" : "bg-white/[0.04] text-gray-500"}`}>{c.status}</span></td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => handleEdit(c)} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold rounded border border-white/[0.06] hover:text-white hover:bg-white/[0.08] transition-all duration-150"><Pencil size={10} /></button>
                      <button onClick={() => handleDelete(c._id)} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold rounded border border-white/[0.06] hover:text-red hover:bg-red/10 transition-all duration-150"><Trash2 size={10} /></button>
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
