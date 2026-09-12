import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2, Lock, Mail, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (remember) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full py-3 pl-11 pr-11 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-[0.85rem] " +
    "placeholder:text-gray-600 focus:outline-none focus:border-red/50 focus:bg-white/[0.05] " +
    "focus:shadow-[0_0_0_3px_rgba(227,27,35,0.08),0_0_20px_-5px_rgba(227,27,35,0.15)] transition-all duration-300";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 login-grid pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-red/[0.07] blur-[120px] login-orb pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-[480px] h-[480px] rounded-full bg-red/[0.05] blur-[130px] login-orb pointer-events-none" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/3 right-[15%] w-[220px] h-[220px] rounded-full bg-white/[0.03] blur-[90px] login-orb pointer-events-none" style={{ animationDelay: "6s" }} />

      <div className="w-full max-w-[400px] relative z-10">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Patriots BBC" className="h-16 w-auto object-contain mx-auto mb-6 filter drop-shadow-[0_4px_20px_rgba(227,27,35,0.4)]" />
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-red/40" />
            <div className="text-[0.6rem] tracking-[6px] uppercase text-gray-500 font-semibold">Admin Panel</div>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-red/40" />
          </div>
        </div>

        <div className={`relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ${shake ? "login-shake" : ""}`}>
          {/* Top red hairline */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red/70 to-transparent pointer-events-none" />

          {error && (
            <div className="bg-red/10 border border-red/25 rounded-lg px-4 py-3 mb-6 flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-red shadow-[0_0_6px_rgba(227,27,35,0.8)]" />
              <p className="text-red text-[0.8rem] font-medium tracking-[0.5px]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-[0.65rem] font-semibold uppercase tracking-[2px] text-gray-500">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" strokeWidth={1.8} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@patriots.com" autoComplete="email"
                  className={`${inputClass} pl-11 pr-4`} />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-[0.65rem] font-semibold uppercase tracking-[2px] text-gray-500">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" strokeWidth={1.8} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password"
                  className={inputClass} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-300 transition-colors cursor-pointer">
                  {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button type="button" onClick={() => setRemember(!remember)}
                className="flex items-center gap-2 text-[0.7rem] text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                <span className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${remember ? "bg-red border-red shadow-[0_0_8px_rgba(227,27,35,0.5)]" : "border-white/20"}`}>
                  {remember && <Check size={11} strokeWidth={3} className="text-white" />}
                </span>
                Remember me
              </button>
              <span className="text-[0.7rem] text-gray-600">Protected area</span>
            </div>

            <button type="submit" disabled={loading}
              className="btn-ripple w-full py-3.5 bg-red text-white text-[0.7rem] font-bold uppercase tracking-[3px] rounded-lg cursor-pointer hover:bg-red-dark hover:shadow-[0_6px_30px_rgba(227,27,35,0.35)] hover:-translate-y-px active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red disabled:hover:shadow-none flex items-center justify-center gap-2.5 relative overflow-hidden">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" strokeWidth={2.5} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-7">
          <a href="/" className="inline-flex items-center gap-2 text-[0.7rem] text-gray-600 hover:text-white transition-colors tracking-[2px] uppercase font-semibold group">
            <ArrowLeft size={12} strokeWidth={2.2} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Back to website
          </a>
        </div>
      </div>
    </div>
  );
}