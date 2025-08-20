import React, { useState, useEffect } from 'react';
import { taskService, generateTaskId, formatDateForAPI } from '../services/projectService';

const TaskEditor = ({ project, onTasksUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToEditId, setTaskToEditId] = useState(null); // Track the ID of the task being edited
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    start: '',
    end: '',
    progress: 0,
    dependencies: [],
    custom_class: ''
  });

  useEffect(() => {
    if (project && project.tasks) {
      setTasks(project.tasks);
    }
  }, [project]);

  const resetForm = () => {
    setFormData({
      id: generateTaskId(),
      name: '',
      start: '',
      end: '',
      progress: 0,
      dependencies: [],
      custom_class: ''
    });
    setEditingTask(null);
    setTaskToEditId(null);
    setShowAddForm(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value) : value
    }));
  };

  const handleDependenciesChange = (e) => {
    const { value } = e.target;
    const dependencies = value.split(',').map(dep => dep.trim()).filter(dep => dep);
    setFormData(prev => ({
      ...prev,
      dependencies
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Task name is required');
      return false;
    }
    if (!formData.start) {
      setError('Start date is required');
      return false;
    }
    if (!formData.end) {
      setError('End date is required');
      return false;
    }
    if (new Date(formData.start) >= new Date(formData.end)) {
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

      const taskData = {
        ...formData,
        start: formatDateForAPI(formData.start),
        end: formatDateForAPI(formData.end)
      };

      if (editingTask) {
        // Update existing task
        await taskService.updateTask(project._id, editingTask.id, taskData);
        setTasks(prev => prev.map(task => 
          task.id === editingTask.id ? { ...task, ...taskData } : task
        ));
        setSuccess('Task updated successfully!');
      } else {
        // Add new task
        await taskService.addTask(project._id, taskData);
        setTasks(prev => [...prev, taskData]);
        setSuccess('Task added successfully!');
      }

      // Notify parent component
      if (onTasksUpdate) {
        onTasksUpdate();
      }

      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save task. Please try again.');
      console.error('Error saving task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      id: task.id,
      name: task.name,
      start: task.start.split('T')[0], // Format for input[type="date"]
      end: task.end.split('T')[0],
      progress: task.progress || 0,
      dependencies: task.dependencies || [],
      custom_class: task.custom_class || ''
    });
    setEditingTask(task);
    setTaskToEditId(task.id); // Set the ID of the task being edited
    setShowAddForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await taskService.deleteTask(project._id, taskId);
        setTasks(prev => prev.filter(task => task.id !== taskId));
        setSuccess('Task deleted successfully!');
        
        if (onTasksUpdate) {
          onTasksUpdate();
        }
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error('Error deleting task:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartAdd = () => {
    resetForm();
    setFormData(prev => ({ ...prev, id: generateTaskId() }));
    setShowAddForm(true);
  };

  if (!project) {
    return (
      <div className="section">
        <h2>Task Management</h2>
        <div className="empty-state">
          <h3>No project selected</h3>
          <p>Select a project to manage its tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Tasks for "{project.projectName}"</h2>
        <button 
          className="btn btn-primary" 
          onClick={handleStartAdd}
          disabled={loading}
        >
          Add Task
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f7fafc' }}>
          <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
          
          <div className="form-group">
            <label>Task ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              required
              disabled={!!editingTask}
              placeholder="Unique task identifier"
            />
          </div>

          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter task name"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="start"
                value={formData.start}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="end"
                value={formData.end}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Progress (%)</label>
            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleInputChange}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontWeight: '500' }}>
              {formData.progress}%
            </div>
          </div>

          <div className="form-group">
            <label>Dependencies (comma-separated task IDs)</label>
            <input
              type="text"
              value={formData.dependencies.join(', ')}
              onChange={handleDependenciesChange}
              placeholder="task_1, task_2, ..."
            />
          </div>

          <div className="form-group">
            <label>Custom CSS Class</label>
            <input
              type="text"
              name="custom_class"
              value={formData.custom_class}
              onChange={handleInputChange}
              placeholder="custom-class-name"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingTask ? 'Update Task' : 'Add Task')}
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
        </form>
      )}

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks yet</h3>
            <p>Add your first task to get started</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-info">
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{task.name}</h4>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  ID: {task.id}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  {new Date(task.start).toLocaleDateString()} - {new Date(task.end).toLocaleDateString()}
                </p>
                {task.dependencies && task.dependencies.length > 0 && (
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>
                    Dependencies: {task.dependencies.join(', ')}
                  </p>
                )}
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    Progress: {task.progress || 0}%
                  </div>
                  <div className="progress-bar" style={{ height: '8px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ width: `${task.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="task-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleEdit(task)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(task.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskEditor;
