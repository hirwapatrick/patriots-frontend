import { useState, useEffect } from "react";
import { projectAPI, categoryAPI } from "../services/api";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    projectAPI
      .getAll(params)
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="projects-page">
      <h1>Projects</h1>

      <div className="category-filters">
        <button
          className={`filter-btn ${activeCategory === "" ? "active" : ""}`}
          onClick={() => setActiveCategory("")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`filter-btn ${activeCategory === cat._id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
