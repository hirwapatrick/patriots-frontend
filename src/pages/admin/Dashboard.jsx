import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardAPI, playerAPI, gameAPI, newsAPI } from "../../services/api";
import {
  Users, Trophy, Newspaper, UserPlus,
  Plus, PenLine, Image, Award, Handshake,
  Settings, MessageSquare, Loader2, ChevronRight
} from "lucide-react";

const quickActionIcons = {
  "Add Player": UserPlus,
  "Add Game": Trophy,
  "Write Article": PenLine,
  "Add Staff": UserPlus,
  "Manage Gallery": Image,
  "Site Settings": Settings,
};

export default function Dashboard() {
  const [stats, setStats] = useState({ players: 0, games: 0, news: 0, staff: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardAPI.getStats().catch(() => null),
      playerAPI.getAll({}).catch(() => ({ data: [] })),
      gameAPI.getAll({}).catch(() => ({ data: [] })),
      newsAPI.getAll({}).catch(() => ({ data: [] })),
    ]).then(([dash, pl, gm, nw]) => {
      if (dash?.data?.stats) setStats((s) => ({ ...s, ...dash.data.stats }));
      else setStats({ players: pl.data.length, games: gm.data.length, news: nw.data.length, staff: 0 });
      const acts = [...gm.data.slice(0, 3).map((g) => ({
        label: `${g.homeTeam} vs ${g.awayTeam}`, date: g.date, type: "game", sub: g.venue || "League",
      })), ...nw.data.slice(0, 3).map((n) => ({
        label: n.title, date: n.publishedDate, type: "news", sub: n.category || "Article",
      }))].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
      setRecentActivity(acts);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={24} className="text-red animate-spin" strokeWidth={1.5} />
        <span className="text-[0.7rem] text-gray-500 uppercase tracking-[3px] font-medium">Loading</span>
      </div>
    </div>
  );

  const statCards = [
    { label: "Players", count: stats.players, to: "/admin/players/new", Icon: Users },
    { label: "Games", count: stats.games, to: "/admin/games/new", Icon: Trophy },
    { label: "News", count: stats.news, to: "/admin/news/new", Icon: Newspaper },
    { label: "Staff", count: stats.staff, to: "/admin/staff/new", Icon: UserPlus },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-[2.2rem] tracking-[2px] uppercase text-white leading-none">Dashboard</h1>
        <p className="text-gray-500 text-[0.8rem] mt-1.5 font-medium">Overview of your content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8 max-xl:grid-cols-2 max-sm:grid-cols-1">
        {statCards.map((s) => (
          <Link key={s.label} to={s.to}
            className="group relative bg-black-card border border-white/[0.06] rounded-lg p-5 no-underline text-white overflow-hidden hover:border-red/20 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-red/10 flex items-center justify-center text-red">
                <s.Icon size={18} strokeWidth={1.5} />
              </div>
              <span className="text-[0.55rem] font-semibold tracking-[2px] text-gray-600 uppercase">{s.label}</span>
            </div>
            <div className="font-heading text-[2.8rem] text-white leading-none tracking-[1px]">{s.count}</div>
            <div className="mt-3 flex items-center gap-1 text-[0.65rem] text-gray-600 uppercase tracking-[1.5px] font-medium group-hover:text-red/60 transition-colors duration-300">
              Manage <ChevronRight size={12} strokeWidth={2} />
            </div>
          </Link>
        ))}
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-4 max-xl:grid-cols-1">
        {/* Activity */}
        <div className="bg-black-card border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300">Recent Activity</h2>
            <span className="text-[0.6rem] text-gray-600 uppercase tracking-[2px]">{recentActivity.length} items</span>
          </div>
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-gray-600 text-[0.8rem]">No recent activity.</div>
          ) : (
            <div>
              {recentActivity.map((act, i) => (
                <div key={i} className={`px-6 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-150 ${i < recentActivity.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${act.type === "game" ? "bg-red" : "bg-blue-500"}`} />
                    <div className="min-w-0">
                      <div className="text-[0.8rem] text-gray-200 font-medium truncate">{act.label}</div>
                      <div className="text-[0.65rem] text-gray-600 mt-0.5">{act.sub}</div>
                    </div>
                  </div>
                  <span className="text-[0.7rem] text-gray-600 flex-shrink-0 ml-4">
                    {new Date(act.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-black-card border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-[0.8rem] font-semibold tracking-[1.5px] uppercase text-gray-300">Quick Actions</h2>
          </div>
          <div className="p-4">
            {[
              { to: "/admin/players/new", label: "Add Player", Icon: UserPlus },
              { to: "/admin/games/new", label: "Add Game", Icon: Trophy },
              { to: "/admin/news/new", label: "Write Article", Icon: PenLine },
              { to: "/admin/staff/new", label: "Add Staff", Icon: Users },
              { to: "/admin/gallery", label: "Manage Gallery", Icon: Image },
              { to: "/admin/site-settings", label: "Site Settings", Icon: Settings },
            ].map((action) => (
              <Link key={action.to} to={action.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[0.8rem] text-gray-400 font-medium hover:bg-white/[0.04] hover:text-gray-200 transition-all duration-150 no-underline">
                <action.Icon size={15} strokeWidth={1.5} className="text-gray-600" />
                <span>{action.label}</span>
                <ChevronRight size={14} strokeWidth={2} className="ml-auto text-gray-700" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
