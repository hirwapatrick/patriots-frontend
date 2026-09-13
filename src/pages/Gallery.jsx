import { useState, useEffect, useCallback } from "react";
import { galleryAPI } from "../services/api";
import { Loader2, X, ChevronLeft, ChevronRight, Image } from "lucide-react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    galleryAPI.getAll({}).then((res) => { setImages(res.data); setLoading(false); });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") closeLightbox(); if (e.key === "ArrowLeft") navigate(-1); if (e.key === "ArrowRight") navigate(1); };
    if (lightbox !== null) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [lightbox, closeLightbox]);

  const navigate = (dir) => {
    if (lightbox === null) return;
    setLightbox((prev) => (prev + dir + images.length) % images.length);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
      <div className="basketball-loader" />
      <span className="text-[0.65rem] uppercase tracking-[4px] text-gray-500 font-bold">Loading Gallery</span>
    </div>
  );

  return (
    <div>
      <section className="page-hero page-hero-compact">
        <span className="inline-block font-heading text-[0.85rem] tracking-[6px] text-red mb-1 uppercase page-hero-subtitle">Gallery</span>
        <h1 className="font-heading text-[clamp(3rem,8vw,6rem)] uppercase tracking-[3px] leading-[0.9] page-hero-title">Moments</h1>
      </section>

      <section className="bg-black py-10 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          {images.length === 0 ? (
            <div className="py-20 text-center">
              <Image size={48} strokeWidth={1} className="text-white/10 mx-auto mb-4" />
              <p className="text-gray-600 text-[0.85rem] uppercase tracking-[2px]">No photos yet.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((img, i) => (
                <div key={img._id} className="gallery-item cursor-pointer group card-enter" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => setLightbox(i)}>
                  <img src={img.imageUrl} alt={img.caption || "Gallery photo"} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
                    <div>
                      <div className="w-6 h-[1px] bg-red mb-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      <span className="text-white text-[0.8rem] font-semibold uppercase tracking-[1px]">{img.caption || "View"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[999] flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/[0.04] border border-white/[0.08] text-white w-12 h-12 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300 rounded-full">
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <img src={images[lightbox].imageUrl} alt="" className="max-w-[90vw] max-h-[85vh] object-contain animate-[scaleIn_0.4s_cubic-bezier(0.16,1,0.3,1)_both]" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); navigate(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/[0.04] border border-white/[0.08] text-white w-12 h-12 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300 rounded-full">
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/[0.04] border border-white/[0.08] text-white w-10 h-10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-110 hover:rotate-90 transition-all duration-300 rounded-full">
            <X size={18} strokeWidth={1.5} />
          </button>
          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-5 text-white/60 text-[0.65rem] font-bold uppercase tracking-[2px]">
            <span className="bg-white/[0.06] px-3 py-1.5 rounded-full">{lightbox + 1} / {images.length}</span>
            {images[lightbox].caption && <span className="text-white/80">{images[lightbox].caption}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
