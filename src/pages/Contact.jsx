import { useState } from "react";
import { contactAPI } from "../services/api";
import { Loader2, Send, CheckCircle, AlertCircle, Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      await contactAPI.submit(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <section className="page-hero">
        <span className="inline-block font-heading text-[0.85rem] tracking-[6px] text-red mb-1 uppercase page-hero-subtitle">Contact</span>
        <h1 className="font-heading text-[clamp(3rem,8vw,6rem)] uppercase tracking-[3px] leading-[0.9] page-hero-title">Get In Touch</h1>
      </section>

      <section className="bg-black text-white py-20 px-4 md:px-8">
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-[1fr_1.5fr] gap-12 max-md:grid-cols-1">
            {/* Info side */}
            <div className="reveal">
              <h2 className="font-heading text-[1.5rem] tracking-[2px] uppercase mb-6">Let&apos;s Talk</h2>
              <p className="text-gray-500 text-[0.9rem] font-light leading-relaxed mb-8">Have a question or want to get involved? We&apos;d love to hear from you.</p>
              <div className="space-y-5">
                {[
                  { icon: Mail, label: "Email", value: "info@patriots.com" },
                  { icon: Phone, label: "Phone", value: "+250 788 000 000" },
                  { icon: MapPin, label: "Location", value: "Kigali, Rwanda" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-red/10 group-hover:border-red/20 transition-all duration-300">
                      <Icon size={15} strokeWidth={1.5} className="text-red" />
                    </div>
                    <div>
                      <div className="text-gray-600 text-[0.6rem] font-bold uppercase tracking-[3px] mb-0.5">{label}</div>
                      <div className="text-white text-[0.85rem] font-light">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form side */}
            <div className="reveal reveal-delay-2">
              {success && (
                <div className="bg-black-card border border-red/20 p-6 text-center mb-8 flex items-center justify-center gap-3 animate-[scaleIn_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                  <CheckCircle size={18} strokeWidth={1.5} className="text-red" />
                  <div>
                    <p className="font-heading text-[0.85rem] tracking-[2px] uppercase text-white">Message Sent</p>
                    <p className="text-gray-500 mt-1 text-[0.8rem]">Thank you for contacting us. We&apos;ll get back soon.</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="bg-red/5 border border-red/20 p-4 mb-6 flex items-center gap-2 animate-[fadeInUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
                  <AlertCircle size={16} strokeWidth={1.5} className="text-red" />
                  <span className="text-red text-[0.85rem]">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <div className="floating-group">
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder=" "
                      className="w-full py-3.5 px-4 border border-white/[0.08] bg-black-card text-white text-[0.9rem] glow-input rounded-sm" />
                    <label className="floating-label">Name</label>
                  </div>
                  <div className="floating-group">
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder=" "
                      className="w-full py-3.5 px-4 border border-white/[0.08] bg-black-card text-white text-[0.9rem] glow-input rounded-sm" />
                    <label className="floating-label">Email</label>
                  </div>
                </div>
                <div className="floating-group">
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required placeholder=" "
                    className="w-full py-3.5 px-4 border border-white/[0.08] bg-black-card text-white text-[0.9rem] glow-input rounded-sm" />
                  <label className="floating-label">Subject</label>
                </div>
                <div className="floating-group">
                  <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={5} placeholder=" "
                    className="w-full py-3.5 px-4 border border-white/[0.08] bg-black-card text-white text-[0.9rem] resize-none glow-input rounded-sm" />
                  <label className="floating-label">Message</label>
                </div>
                <button type="submit" disabled={loading}
                  className="btn-ripple w-full py-4 bg-red text-white text-[0.72rem] font-bold uppercase tracking-[2px] border-none cursor-pointer flex items-center justify-center gap-2 hover:bg-red-dark hover:-translate-y-px hover:shadow-[0_6px_40px_rgba(227,27,35,0.3)] transition-all duration-300 disabled:opacity-50 rounded-sm relative overflow-hidden">
                  {loading ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <><Send size={13} strokeWidth={2} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
