import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { staffAPI, uploadAPI } from "../../services/api";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

export default function StaffForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", role: "Head Coach", photo: "",
    biography: "", nationality: "", status: "active", order: 0,
    socialLinks: { instagram: "", twitter: "", facebook: "" },
  });

  useEffect(() => {
    if (isEdit) {
      staffAPI.getById(id).then((res) => {
        const s = res.data;
        setForm({ ...s, socialLinks: s.socialLinks || { instagram: "", twitter: "", facebook: "" } });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try { const res = await uploadAPI.single(fd); setForm((prev) => ({ ...prev, photo: res.data.url })); }
    catch { alert("Upload failed"); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      isEdit ? await staffAPI.update(id, form) : await staffAPI.create(form);
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
        {isEdit ? "Edit Staff" : "Add Staff"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-[800px]">
        {/* Basic */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Information</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>First Name</label><input name="firstName" value={form.firstName} onChange={handleChange} required className={inputClass} /></div>
            <div><label className={labelClass}>Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} required className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className={labelClass}>Role</label>
              <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
                <option value="Head Coach">Head Coach</option><option value="Assistant Coach">Assistant Coach</option><option value="Team Manager">Team Manager</option><option value="Technical Staff">Technical Staff</option><option value="Medical Staff">Medical Staff</option>
              </select>
            </div>
            <div><label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div><label className={labelClass}>Nationality</label><input name="nationality" value={form.nationality} onChange={handleChange} className={inputClass} /></div>
        </div>

        {/* Photo */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Photo</h2>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/[0.08] rounded-lg cursor-pointer hover:border-red/30 hover:bg-white/[0.02] transition-all duration-200">
            {uploading ? (
              <div className="flex items-center gap-2 text-gray-500"><Loader2 size={16} className="animate-spin" /> Uploading...</div>
            ) : form.photo ? (
              <img src={form.photo} alt="Preview" className="h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-600"><Upload size={20} /> <span className="text-[0.75rem]">Click to upload</span></div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>

        {/* Bio */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-6 mb-4">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Biography</h2>
          <textarea name="biography" value={form.biography} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} />
        </div>

        {/* Social + Order */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-6 mb-6">
          <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300 mb-5">Social & Ordering</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><label className={labelClass}>Instagram</label><input name="socialLinks.instagram" value={form.socialLinks.instagram} onChange={handleChange} placeholder="https://instagram.com/..." className={inputClass} /></div>
            <div><label className={labelClass}>Twitter</label><input name="socialLinks.twitter" value={form.socialLinks.twitter} onChange={handleChange} placeholder="https://x.com/..." className={inputClass} /></div>
            <div><label className={labelClass}>Facebook</label><input name="socialLinks.facebook" value={form.socialLinks.facebook} onChange={handleChange} placeholder="https://facebook.com/..." className={inputClass} /></div>
          </div>
          <div className="max-w-[200px]">
            <label className={labelClass}>Display Order</label>
            <input name="order" type="number" value={form.order} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[2px] rounded-md hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_4px_24px_rgba(227,27,35,0.25)] transition-all duration-300">
            {isEdit ? "Update Staff" : "Create Staff"}
          </button>
          <button type="button" onClick={() => navigate("/admin/dashboard")} className="px-6 py-2.5 bg-white/[0.04] text-gray-400 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-md border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
