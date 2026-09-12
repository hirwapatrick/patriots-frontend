import { useState, useEffect } from "react";
import { galleryAPI, gameAPI, uploadAPI } from "../../services/api";
import { ArrowLeft, Upload, Loader2, Pencil, Trash2, Image, Plus } from "lucide-react";

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [games, setGames] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "", imageUrl: "", caption: "", category: "Team", game: "",
    date: new Date().toISOString().split("T")[0], status: "published", order: 0,
  });

  useEffect(() => {
    loadImages();
    gameAPI.getAll().then((res) => setGames(res.data)).catch(() => {});
  }, []);

  const loadImages = () => { galleryAPI.getAllAdmin().then((res) => setImages(res.data)); };

  const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try { const res = await uploadAPI.single(fd); setForm((prev) => ({ ...prev, imageUrl: res.data.url })); }
    catch { alert("Upload failed"); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editingId ? await galleryAPI.update(editingId, form) : await galleryAPI.create(form);
      resetForm(); loadImages();
    } catch (err) { alert(err.response?.data?.message || "Save failed"); }
  };

  const handleEdit = (img) => {
    setForm({ title: img.title || "", imageUrl: img.imageUrl, caption: img.caption || "", category: img.category || "Team", game: img.game?._id || "", date: img.date ? img.date.split("T")[0] : "", status: img.status || "published", order: img.order || 0 });
    setEditingId(img._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    await galleryAPI.delete(id); loadImages();
  };

  const resetForm = () => {
    setForm({ title: "", imageUrl: "", caption: "", category: "Team", game: "", date: new Date().toISOString().split("T")[0], status: "published", order: 0 });
    setEditingId(null);
  };

  const inputClass = "w-full py-2.5 px-3.5 bg-white/[0.03] border border-white/[0.08] rounded-md text-white text-[0.85rem] placeholder:text-gray-600 focus:outline-none focus:border-red/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass = "block mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-gray-500";

  return (
    <div>
      <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 text-[0.8rem] hover:text-white transition-colors mb-6">
        <ArrowLeft size={14} /> Back
      </button>
      <h1 className="font-heading text-[2.2rem] tracking-[2px] uppercase text-white leading-none mb-8">Gallery Manager</h1>

      {/* Upload Form */}
      <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-6 mb-6">
        <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">{editingId ? "Edit Image" : "Upload Image"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/[0.08] rounded-lg cursor-pointer hover:border-red/30 hover:bg-white/[0.02] transition-all duration-200">
              {uploading ? (
                <div className="flex items-center gap-2 text-gray-500"><Loader2 size={16} className="animate-spin" /> Uploading...</div>
              ) : form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" className="h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-600"><Upload size={20} /> <span className="text-[0.75rem]">Click to upload image</span></div>
              )}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Title</label><input name="title" value={form.title} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Caption</label><input name="caption" value={form.caption} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><label className={labelClass}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                <option value="Games">Games</option><option value="Training">Training</option><option value="Team">Team</option><option value="Events">Events</option><option value="Fans">Fans</option>
              </select>
            </div>
            <div><label className={labelClass}>Related Game</label>
              <select name="game" value={form.game} onChange={handleChange} className={inputClass}>
                <option value="">None</option>
                {games.map((g) => <option key={g._id} value={g._id}>{g.homeTeam} vs {g.awayTeam}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Date</label><input name="date" type="date" value={form.date} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div><label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="published">Published</option><option value="draft">Draft</option>
              </select>
            </div>
            <div><label className={labelClass}>Order</label><input name="order" type="number" value={form.order} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] rounded-md hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.25)] transition-all duration-300">
              {editingId ? "Update" : "Upload"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-white/[0.04] text-gray-400 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-md border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Image Grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300">Gallery Images ({images.length})</h2>
      </div>
      {images.length === 0 ? (
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-12 text-center">
          <Image size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-600 text-[0.85rem]">No images yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          {images.map((img) => (
            <div key={img._id} className="bg-[#111113] border border-white/[0.06] rounded-lg overflow-hidden group">
              <div className="h-[160px] overflow-hidden bg-white/[0.02]">
                <img src={img.imageUrl} alt={img.caption || "Gallery"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <div className="text-[0.6rem] font-bold uppercase tracking-[2px] text-red mb-1">{img.category}</div>
                {img.caption && <div className="text-[0.75rem] text-gray-400 truncate">{img.caption}</div>}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(img)} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold uppercase tracking-[1px] rounded border border-white/[0.06] hover:text-white hover:bg-white/[0.08] transition-all duration-150">
                    <Pencil size={10} /> Edit
                  </button>
                  <button onClick={() => handleDelete(img._id)} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold uppercase tracking-[1px] rounded border border-white/[0.06] hover:text-red hover:bg-red/10 transition-all duration-150">
                    <Trash2 size={10} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
