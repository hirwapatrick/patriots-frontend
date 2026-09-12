import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Home, PenLine, Image, UserPlus, UserCog, User,
  Trophy, Award, Handshake, Settings, MessageSquare, ExternalLink,
  LogOut, ChevronRight
} from "lucide-react";

const navIcons = {
  Overview: LayoutDashboard,
  Homepage: Home,
  "New Article": PenLine,
  Gallery: Image,
  "Add Player": UserPlus,
  "Add Staff": UserCog,
  "Add Game": Trophy,
  Competitions: Award,
  Achievements: Trophy,
  Sponsors: Handshake,
  "Site Settings": Settings,
  Messages: MessageSquare,
};

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/admin/login"); };
  const isActive = (path) => location.pathname === path;

  const sidebarSections = [
    { title: "Overview", links: [{ to: "/admin/dashboard", label: "Overview" }] },
    { title: "Content", links: [{ to: "/admin/homepage", label: "Homepage" }, { to: "/admin/news/new", label: "New Article" }, { to: "/admin/gallery", label: "Gallery" }] },
    { title: "Team", links: [{ to: "/admin/players/new", label: "Add Player" }, { to: "/admin/staff/new", label: "Add Staff" }] },
    { title: "Games", links: [{ to: "/admin/games/new", label: "Add Game" }, { to: "/admin/competitions", label: "Competitions" }] },
    { title: "Club", links: [{ to: "/admin/achievements", label: "Achievements" }, { to: "/admin/sponsors", label: "Sponsors" }] },
    { title: "Settings", links: [{ to: "/admin/site-settings", label: "Site Settings" }, { to: "/admin/messages", label: "Messages" }] },
  ];

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      <aside className="w-[260px] bg-[#0c0c0e] text-white flex flex-col fixed top-0 left-0 bottom-0 overflow-y-auto border-r border-white/[0.06] max-lg:hidden z-40">
        <div className="px-6 py-5 border-b border-white/[0.06]">
          <Link to="/admin/dashboard" className="no-underline block group">
            <img src="/logo.png" alt="Patriots BBC" className="h-9 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(227,27,35,0.35)] transition-opacity duration-300 group-hover:opacity-90" />
            <div className="text-[0.55rem] tracking-[4px] uppercase text-gray-500 mt-2 font-medium">Admin Panel</div>
          </Link>
        </div>

        <div className="flex-1 px-3 py-4">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-5">
              <div className="px-3 mb-1.5 text-[0.55rem] font-semibold tracking-[3px] text-gray-600 uppercase">{section.title}</div>
              <nav className="flex flex-col gap-0.5">
                {section.links.map((link) => {
                  const active = isActive(link.to);
                  const Icon = navIcons[link.label] || LayoutDashboard;
                  return (
                    <Link key={link.to} to={link.to}
                      className={`group flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.8rem] font-medium transition-all duration-150 no-underline ${
                        active
                          ? "bg-red/15 text-red"
                          : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"
                      }`}>
                      <Icon size={15} strokeWidth={active ? 2 : 1.5} className={active ? "text-red" : "text-gray-600 group-hover:text-gray-400"} />
                      <span>{link.label}</span>
                      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="px-3 pb-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.8rem] font-medium text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] transition-all duration-150 no-underline">
            <ExternalLink size={15} strokeWidth={1.5} className="text-gray-600" />
            <span>View Website</span>
          </a>
        </div>

        <div className="px-4 py-4 border-t border-white/[0.06]">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-red/20 flex items-center justify-center text-red">
                <User size={14} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <div className="text-[0.75rem] text-gray-300 font-medium truncate">{user.name || "Admin"}</div>
                <div className="text-[0.6rem] text-gray-600 truncate">{user.email}</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white/[0.04] text-gray-400 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-md border border-white/[0.06] cursor-pointer hover:bg-red/10 hover:text-red hover:border-red/20 transition-all duration-200">
            <LogOut size={13} strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:ml-[260px] overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
