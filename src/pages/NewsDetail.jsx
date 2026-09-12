import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { newsAPI } from "../services/api";
import { Loader2, ArrowLeft, Calendar, Tag, Clock } from "lucide-react";

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    newsAPI.getById(id).then((res) => { setArticle(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
      <div className="basketball-loader" />
    </div>
  );
  if (!article) return <div className="flex items-center justify-center min-h-screen bg-black text-gray-500 uppercase tracking-[2px] text-[0.85rem]">Article not found.</div>;

  return (
    <div>
      {/* Reading progress bar */}
      <div className="reading-progress" style={{ width: `${readProgress}%` }} />

      {/* Hero */}
      <section className="relative bg-black py-28 px-4 md:px-8 overflow-hidden">
        {article.featuredImage && <div className="absolute inset-0 opacity-15"><img src={article.featuredImage} alt="" className="w-full h-full object-cover scale-105" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative z-10 max-w-[800px] mx-auto">
          <Link to="/news" className="animated-link inline-flex items-center gap-1.5 text-gray-500 text-[0.65rem] font-bold uppercase tracking-[2px] hover:text-white transition-colors mb-8 no-underline">
            <ArrowLeft size={13} strokeWidth={2} /> All News
          </Link>
          {article.category && (
            <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[3px] text-red mb-3">
              <span className="w-2 h-2 bg-red rounded-full" />
              {article.category}
            </span>
          )}
          <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] uppercase tracking-[2px] leading-[0.95] text-white mt-2 animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_both]">{article.title}</h1>
          <div className="flex items-center gap-4 mt-6 text-gray-500 text-[0.7rem] font-medium uppercase tracking-[2px]">
            <span className="flex items-center gap-1.5"><Calendar size={12} strokeWidth={1.5} /> {new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
            {article.readTime && <span className="flex items-center gap-1.5"><Clock size={12} strokeWidth={1.5} /> {article.readTime} min read</span>}
          </div>
        </div>
      </section>

      {/* Featured image */}
      {article.featuredImage && (
        <section className="bg-black px-4 md:px-8 pb-0">
          <div className="max-w-[1000px] mx-auto">
            <img src={article.featuredImage} alt={article.title} className="w-full aspect-[16/9] object-cover" />
          </div>
        </section>
      )}

      {/* Body */}
      <section className="bg-[#050505] py-14 px-4 md:px-8">
        <div className="max-w-[800px] mx-auto">
          <div className="prose-content text-gray-400 leading-[1.9] font-light text-[0.95rem] whitespace-pre-wrap animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.3s_both]">{article.content}</div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-wrap gap-2">
              {article.tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.03] border border-white/[0.06] text-gray-500 text-[0.6rem] font-bold uppercase tracking-[2px] hover:border-red/20 hover:text-red transition-all duration-300">
                  <Tag size={9} strokeWidth={1.5} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
