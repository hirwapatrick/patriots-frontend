import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="project-card">
      {project.thumbnail && (
        <div className="project-card-image">
          <img src={project.thumbnail} alt={project.title} />
        </div>
      )}
      <div className="project-card-body">
        {project.category && (
          <span className="project-card-category">{project.category.name}</span>
        )}
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.tags && project.tags.length > 0 && (
          <div className="project-card-tags">
            {project.tags.map((tag, i) => (
              <span key={i} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
