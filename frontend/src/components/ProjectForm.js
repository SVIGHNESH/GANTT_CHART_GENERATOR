import React, { useState } from 'react';
import { projectService, formatDateForAPI } from '../services/projectService';

const ProjectForm = ({ onProjectCreated }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Planning',
    createdBy: 'Admin'
  });

  const resetForm = () => {
    setFormData({
      projectName: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'Planning',
      createdBy: 'Admin'
    });
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.projectName.trim()) {
      setError('Project name is required');
      return false;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!formData.endDate) {
      setError('End date is required');
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const projectData = {
        ...formData,
        startDate: formatDateForAPI(formData.startDate),
        endDate: formatDateForAPI(formData.endDate),
        tasks: [] // Initialize with empty tasks array
      };

      const response = await projectService.createProject(projectData);
      setSuccess('Project created successfully!');
      
      // Notify parent component
      if (onProjectCreated) {
        onProjectCreated(response);
      }

      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to create project. Please try again.');
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Create New Project</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ 
          padding: '1.5rem', 
          border: '1px solid #e2e8f0', 
          borderRadius: '10px', 
          background: '#f7fafc' 
        }}>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              required
              placeholder="Enter project name"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter project description (optional)"
              rows="3"
              maxLength="500"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div className="form-group">
              <label>Created By</label>
              <input
                type="text"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
                placeholder="Enter creator name"
                maxLength="50"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            <p>* Required fields</p>
            <p>Once created, you can add tasks to your project and visualize them in a Gantt chart.</p>
          </div>
        </form>
      )}

      {!showForm && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h3>Ready to start a new project?</h3>
          <p>Click "New Project" to create a project and start managing tasks with Gantt charts.</p>
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ color: '#333' }}>Features:</h4>
            <ul style={{ textAlign: 'left', display: 'inline-block', color: '#666' }}>
              <li>Visual Gantt chart representation</li>
              <li>Task dependency management</li>
              <li>Progress tracking</li>
              <li>Multiple view modes (Day, Week, Month)</li>
              <li>Interactive task editing</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
