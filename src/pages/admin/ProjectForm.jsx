import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectAPI, categoryAPI, uploadAPI } from "../../services/api";
import { ArrowLeft, Upload, Loader2, Star } from "lucide-react";

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", description: "", content: "", thumbnail: "",
    images: [], category: "", tags: "", featured: false, status: "draft", order: 0,
  });

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data));
    if (isEdit) {
      projectAPI.getAllAdmin().then((res) => {
        const p = res.data.find((p) => p._id === id);
        if (p) setForm({ ...p, category: p.category?._id || "", tags: p.tags?.join(", ") || "" });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => { const { name, value, type, checked } = e.target; setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value })); };
  const handleSlug = (e) => { const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); setForm((prev) => ({ ...prev, title: e.target.value, slug })); };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try { const res = await uploadAPI.single(fd); setForm((prev) => ({ ...prev, thumbnail: res.data.url })); }
    catch { alert("Upload failed"); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [] };
    try {
      isEdit ? await projectAPI.update(id, payload) : await projectAPI.create(payload);
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
        {isEdit ? "Edit Project" : "New Project"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-[800px]">
        <div className="bg-black-card border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Content</h2>
          <div className="mb-4"><label className={labelClass}>Title</label><input name="title" value={form.title} onChange={handleSlug} required className={inputClass} /></div>
          <div className="mb-4"><label className={labelClass}>Slug</label><input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} /></div>
          <div className="mb-4"><label className={labelClass}>Description</label><textarea name="description" value={form.description} onChange={handleChange} required rows={3} className={`${inputClass} resize-none`} /></div>
          <div><label className={labelClass}>Content (HTML)</label><textarea name="content" value={form.content} onChange={handleChange} rows={8} className={`${inputClass} resize-none font-mono text-[0.8rem]`} /></div>
        </div>

        <div className="bg-black-card border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Thumbnail</h2>
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/[0.08] rounded-lg cursor-pointer hover:border-red/30 hover:bg-white/[0.02] transition-all duration-200">
            {uploading ? <div className="flex items-center gap-2 text-gray-500"><Loader2 size={16} className="animate-spin" /></div>
              : form.thumbnail ? <img src={form.thumbnail} alt="Thumbnail" className="h-full object-contain" />
              : <div className="flex flex-col items-center gap-2 text-gray-600"><Upload size={20} /><span className="text-[0.75rem]">Click to upload</span></div>}
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="bg-black-card border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Settings</h2>
          <div className="mb-4"><label className={labelClass}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required className={inputClass}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="mb-4"><label className={labelClass}>Tags (comma-separated)</label><input name="tags" value={form.tags} onChange={handleChange} className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </select>
            </div>
            <div><label className={labelClass}>Order</label><input type="number" name="order" value={form.order} onChange={handleChange} className={inputClass} /></div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-red" />
            <Star size={14} className="text-gray-500" />
            <span className="text-[0.8rem] text-gray-400 font-medium">Featured</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] rounded-md hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.25)] transition-all duration-300">
            {isEdit ? "Update Project" : "Create Project"}
          </button>
          <button type="button" onClick={() => navigate("/admin/dashboard")} className="px-6 py-2.5 bg-white/[0.04] text-gray-400 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-md border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
