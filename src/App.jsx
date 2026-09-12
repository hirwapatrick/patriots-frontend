import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/admin/AdminLayout";

import Home from "./pages/Home";
import Team from "./pages/Team";
import PlayerDetail from "./pages/PlayerDetail";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Gallery from "./pages/Gallery";
import Club from "./pages/Club";
import Sponsors from "./pages/Sponsors";
import Contact from "./pages/Contact";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import PlayerForm from "./pages/admin/PlayerForm";
import StaffForm from "./pages/admin/StaffForm";
import GameForm from "./pages/admin/GameForm";
import NewsForm from "./pages/admin/NewsForm";
import GalleryManager from "./pages/admin/GalleryManager";
import SponsorManager from "./pages/admin/SponsorManager";
import AchievementManager from "./pages/admin/AchievementManager";
import CompetitionManager from "./pages/admin/CompetitionManager";
import HomepageSettings from "./pages/admin/HomepageSettings";
import SiteSettings from "./pages/admin/SiteSettings";
import ContactMessages from "./pages/admin/ContactMessages";
import CategoryManager from "./pages/admin/CategoryManager";
import ProjectForm from "./pages/admin/ProjectForm";

import "./App.css";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user ? <Outlet /> : <Navigate to="/admin/login" />;
}

function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      <div className="grain-overlay" />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/players/:id" element={<PlayerDetail />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:id" element={<GameDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/club" element={<Club />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout><Outlet /></AdminLayout>}>
              {/* Dashboard */}
              <Route path="/admin/dashboard" element={<Dashboard />} />

              {/* Players */}
              <Route path="/admin/players/new" element={<PlayerForm />} />
              <Route path="/admin/players/:id/edit" element={<PlayerForm />} />

              {/* Staff */}
              <Route path="/admin/staff/new" element={<StaffForm />} />
              <Route path="/admin/staff/:id/edit" element={<StaffForm />} />

              {/* Games */}
              <Route path="/admin/games/new" element={<GameForm />} />
              <Route path="/admin/games/:id/edit" element={<GameForm />} />

              {/* News */}
              <Route path="/admin/news/new" element={<NewsForm />} />
              <Route path="/admin/news/:id/edit" element={<NewsForm />} />

              {/* Gallery */}
              <Route path="/admin/gallery" element={<GalleryManager />} />

              {/* Sponsors */}
              <Route path="/admin/sponsors" element={<SponsorManager />} />

              {/* Achievements */}
              <Route path="/admin/achievements" element={<AchievementManager />} />

              {/* Competitions */}
              <Route path="/admin/competitions" element={<CompetitionManager />} />

              {/* Settings */}
              <Route path="/admin/homepage" element={<HomepageSettings />} />
              <Route path="/admin/site-settings" element={<SiteSettings />} />
              <Route path="/admin/messages" element={<ContactMessages />} />

              {/* Legacy */}
              <Route path="/admin/categories" element={<CategoryManager />} />
              <Route path="/admin/projects/new" element={<ProjectForm />} />
              <Route path="/admin/projects/:id/edit" element={<ProjectForm />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
