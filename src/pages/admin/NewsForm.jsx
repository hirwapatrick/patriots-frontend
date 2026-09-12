import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { newsAPI, uploadAPI } from "../../services/api";
import { ArrowLeft, Upload, Loader2, Star } from "lucide-react";

export default function NewsForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", coverImage: "",
    category: "Club News", author: "", publishedDate: new Date().toISOString().split("T")[0],
    status: "draft", featured: false, tags: "",
  });

  useEffect(() => {
    if (isEdit) {
      newsAPI.getAllAdmin().then((res) => {
        const a = res.data.find((a) => a._id === id);
        if (a) setForm({ ...a, tags: a.tags?.join(", ") || "", publishedDate: a.publishedDate ? a.publishedDate.split("T")[0] : new Date().toISOString().split("T")[0] });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSlug = (e) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm((prev) => ({ ...prev, title: e.target.value, slug }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try { const res = await uploadAPI.single(fd); setForm((prev) => ({ ...prev, coverImage: res.data.url })); }
    catch { alert("Upload failed"); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [] };
    try {
      isEdit ? await newsAPI.update(id, payload) : await newsAPI.create(payload);
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
        {isEdit ? "Edit Article" : "New Article"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-[800px]">
        {/* Content */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Content</h2>
          <div className="mb-4"><label className={labelClass}>Title</label><input name="title" value={form.title} onChange={handleSlug} required className={inputClass} /></div>
          <div className="mb-4"><label className={labelClass}>Slug</label><input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} /></div>
          <div className="mb-4"><label className={labelClass}>Excerpt</label><textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} /></div>
          <div><label className={labelClass}>Content (HTML)</label><textarea name="content" value={form.content} onChange={handleChange} rows={12} className={`${inputClass} resize-none font-mono text-[0.8rem]`} /></div>
        </div>

        {/* Cover Image */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Cover Image</h2>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/[0.08] rounded-lg cursor-pointer hover:border-red/30 hover:bg-white/[0.02] transition-all duration-200">
            {uploading ? (
              <div className="flex items-center gap-2 text-gray-500"><Loader2 size={16} className="animate-spin" /> Uploading...</div>
            ) : form.coverImage ? (
              <img src={form.coverImage} alt="Cover" className="h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-600"><Upload size={20} /> <span className="text-[0.75rem]">Click to upload cover image</span></div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* Meta */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Metadata</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><label className={labelClass}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                <option value="Game Report">Game Report</option><option value="Team News">Team News</option><option value="Player News">Player News</option><option value="Club News">Club News</option><option value="Announcement">Announcement</option><option value="Community">Community</option>
              </select>
            </div>
            <div><label className={labelClass}>Author</label><input name="author" value={form.author} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Published Date</label><input name="publishedDate" type="date" value={form.publishedDate} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </select>
            </div>
            <div><label className={labelClass}>Tags (comma-separated)</label><input name="tags" value={form.tags} onChange={handleChange} placeholder="news, patriots, basketball" className={inputClass} /></div>
          </div>
          <label className="flex items-center gap-2.5 mt-4 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-red" />
            <Star size={14} className="text-gray-500" />
            <span className="text-[0.8rem] text-gray-400 font-medium">Featured Article</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] rounded-md hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.25)] transition-all duration-300">
            {isEdit ? "Update Article" : "Publish Article"}
          </button>
          <button type="button" onClick={() => navigate("/admin/dashboard")} className="px-6 py-2.5 bg-white/[0.04] text-gray-400 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-md border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
