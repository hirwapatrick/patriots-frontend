import { useState, useEffect } from "react";
import { categoryAPI } from "../../services/api";
import { ArrowLeft, Pencil, Trash2, FolderOpen } from "lucide-react";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadCategories(); }, []);
  const loadCategories = () => { categoryAPI.getAll().then((res) => setCategories(res.data)); };

  const handleSlug = (value) => { setName(value); setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, slug, description };
    editingId ? await categoryAPI.update(editingId, data) : await categoryAPI.create(data);
    resetForm(); loadCategories();
  };

  const handleEdit = (cat) => { setName(cat.name); setSlug(cat.slug); setDescription(cat.description || ""); setEditingId(cat._id); };
  const handleDelete = async (id) => { if (!window.confirm("Delete this category?")) return; await categoryAPI.delete(id); loadCategories(); };
  const resetForm = () => { setName(""); setSlug(""); setDescription(""); setEditingId(null); };

  const inputClass = "w-full py-2.5 px-3.5 bg-white/[0.03] border border-white/[0.08] rounded-md text-white text-[0.85rem] placeholder:text-gray-600 focus:outline-none focus:border-red/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass = "block mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-gray-500";

  return (
    <div>
      <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 text-[0.8rem] hover:text-white transition-colors mb-6">
        <ArrowLeft size={14} /> Back
      </button>
      <h1 className="font-heading text-[2.2rem] tracking-[2px] uppercase text-white leading-none mb-8">Category Manager</h1>

      <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-6 mb-6 max-w-[600px]">
        <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">{editingId ? "Edit Category" : "Add Category"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4"><label className={labelClass}>Name</label><input value={name} onChange={(e) => handleSlug(e.target.value)} required className={inputClass} /></div>
          <div className="mb-4"><label className={labelClass}>Slug</label><input value={slug} onChange={(e) => setSlug(e.target.value)} required className={inputClass} /></div>
          <div className="mb-5"><label className={labelClass}>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={`${inputClass} resize-none`} /></div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] rounded-md hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.25)] transition-all duration-300">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-white/[0.04] text-gray-400 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-md border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300">Categories ({categories.length})</h2>
      </div>
      {categories.length === 0 ? (
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-12 text-center">
          <FolderOpen size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-600 text-[0.85rem]">No categories yet.</p>
        </div>
      ) : (
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg overflow-hidden max-w-[600px]">
          <table className="w-full text-left">
            <thead><tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500">Name</th>
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500">Slug</th>
              <th className="px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-gray-500 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-[0.85rem] font-medium">{cat.name}</td>
                  <td className="px-5 py-3 text-[0.8rem] text-gray-400 font-mono">{cat.slug}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => handleEdit(cat)} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold rounded border border-white/[0.06] hover:text-white hover:bg-white/[0.08] transition-all duration-150"><Pencil size={10} /></button>
                      <button onClick={() => handleDelete(cat._id)} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold rounded border border-white/[0.06] hover:text-red hover:bg-red/10 transition-all duration-150"><Trash2 size={10} /></button>
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
