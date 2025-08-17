import React, { useState, useEffect } from 'react';
import { projectService, formatDateForDisplay } from '../services/projectService';

const ProjectList = ({ onProjectSelect, selectedProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectService.getAllProjects();
      setProjects(response || []);
    } catch (err) {
      setError('Failed to fetch projects. Please try again.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId, event) => {
    event.stopPropagation(); // Prevent project selection when clicking delete
    
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectService.deleteProject(projectId);
        setProjects(projects.filter(p => p._id !== projectId));
        
        // If the deleted project was selected, clear selection
        if (selectedProject && selectedProject._id === projectId) {
          onProjectSelect(null);
        }
      } catch (err) {
        setError('Failed to delete project. Please try again.');
        console.error('Error deleting project:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#48bb78';
      case 'In Progress':
        return '#667eea';
      case 'On Hold':
        return '#ed8936';
      default:
        return '#718096';
    }
  };

  const calculateProjectProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const totalProgress = project.tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
    return Math.round(totalProgress / project.tasks.length);
  };

  if (loading) {
    return (
      <div className="section">
        <h2>Projects</h2>
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Projects</h2>
        <button className="btn btn-secondary" onClick={fetchProjects}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects found</h3>
          <p>Create your first project to get started with Gantt charts</p>
        </div>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <div
              key={project._id}
              className={`project-card ${selectedProject && selectedProject._id === project._id ? 'active' : ''}`}
              onClick={() => onProjectSelect(project)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3>{project.projectName}</h3>
                  {project.description && (
                    <p style={{ marginBottom: '0.5rem' }}>{project.description}</p>
                  )}
                  <p>
                    <strong>Start:</strong> {formatDateForDisplay(project.startDate)} | 
                    <strong> End:</strong> {formatDateForDisplay(project.endDate)}
                  </p>
                  <p>
                    <strong>Status:</strong> 
                    <span 
                      style={{ 
                        color: getStatusColor(project.status),
                        fontWeight: '500',
                        marginLeft: '0.5rem'
                      }}
                    >
                      {project.status}
                    </span>
                  </p>
                  <p>
                    <strong>Tasks:</strong> {project.tasks ? project.tasks.length : 0} | 
                    <strong> Created by:</strong> {project.createdBy || 'Unknown'}
                  </p>
                  
                  {/* Progress Bar */}
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Progress</span>
                      <span style={{ fontSize: '0.9rem' }}>{calculateProjectProgress(project)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${calculateProjectProgress(project)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginLeft: '1rem' }}>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleDeleteProject(project._id, e)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
