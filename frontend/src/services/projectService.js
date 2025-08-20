import axios from 'axios';
const API_URL = 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

// Project API calls
export const projectService = {
  // Get all projects
  getAllProjects: async () => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  // Get a single project by ID
  getProject: async (id) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  // Create a new project
  createProject: async (projectData) => {
    const response = await api.post('/api/projects', projectData);
    return response.data;
  },

  // Update a project
  updateProject: async (id, projectData) => {
    const response = await api.put(`/api/projects/${id}`, projectData);
    return response.data;
  },

  // Delete a project
  deleteProject: async (id) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response;
  },

  // Get project progress
  getProjectProgress: async (id) => {
    const response = await api.get(`/api/projects/${id}/progress`);
    return response.data;
  },
};

// Task API calls
export const taskService = {
  // Get all tasks for a project
  getProjectTasks: async (projectId) => {
    const response = await api.get(`/api/tasks/${projectId}`);
    return response.data;
  },

  // Get a specific task
  getTask: async (projectId, taskId) => {
    const response = await api.get(`/api/tasks/${projectId}/${taskId}`);
    return response.data;
  },

  // Add a new task to a project
  addTask: async (projectId, taskData) => {
    const response = await api.post(`/api/tasks/${projectId}`, taskData);
    return response.data;
  },

  // Update a task
  updateTask: async (projectId, taskId, taskData) => {
    const response = await api.put(`/api/tasks/${projectId}/${taskId}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (projectId, taskId) => {
    const response = await api.delete(`/api/tasks/${projectId}/${taskId}`);
    return response;
  },
};

// Utility functions
export const formatDateForAPI = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export const formatDateForDisplay = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

export const generateTaskId = () => {
  return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export default api;
