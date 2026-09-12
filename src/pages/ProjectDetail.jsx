import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { projectAPI } from "../services/api";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    projectAPI
      .getBySlug(slug)
      .then((res) => setProject(res.data))
      .catch(() => setError("Project not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!project) return null;

  return (
    <div className="project-detail">
      <Link to="/projects" className="back-link">
        &larr; Back to Projects
      </Link>

      {project.category && (
        <span className="project-detail-category">{project.category.name}</span>
      )}
      <h1>{project.title}</h1>

      {project.thumbnail && (
        <img
          src={project.thumbnail}
          alt={project.title}
          className="project-detail-thumbnail"
        />
      )}

      {project.tags && project.tags.length > 0 && (
        <div className="project-detail-tags">
          {project.tags.map((tag, i) => (
            <span key={i} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="project-detail-content">
        <p className="project-detail-description">{project.description}</p>
        {project.content && <div dangerouslySetInnerHTML={{ __html: project.content }} />}
      </div>

      {project.images && project.images.length > 0 && (
        <div className="project-detail-images">
          {project.images.map((img, i) => (
            <img key={i} src={img} alt={`${project.title} ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}
