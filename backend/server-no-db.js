const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage (instead of MongoDB)
let projects = [
  {
    _id: 'sample_project_1',
    projectName: 'Sample Website Project',
    description: 'A sample project to demonstrate the Gantt chart functionality',
    startDate: '2025-08-18',
    endDate: '2025-09-15',
    status: 'In Progress',
    createdBy: 'Demo User',
    tasks: [
      {
        id: 'task_1',
        name: 'Design Phase',
        start: '2025-08-18',
        end: '2025-08-25',
        progress: 80,
        dependencies: [],
        custom_class: 'design-task'
      },
      {
        id: 'task_2',
        name: 'Development',
        start: '2025-08-26',
        end: '2025-09-10',
        progress: 45,
        dependencies: ['task_1'],
        custom_class: 'dev-task'
      },
      {
        id: 'task_3',
        name: 'Testing',
        start: '2025-09-08',
        end: '2025-09-12',
        progress: 0,
        dependencies: ['task_2'],
        custom_class: 'test-task'
      },
      {
        id: 'task_4',
        name: 'Deployment',
        start: '2025-09-13',
        end: '2025-09-15',
        progress: 0,
        dependencies: ['task_3'],
        custom_class: 'deploy-task'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utility function to generate ID
const generateId = () => {
  return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// PROJECT ROUTES

// GET /api/projects - Get all projects
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// GET /api/projects/:id - Get a single project
app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p._id === req.params.id);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  res.json({
    success: true,
    data: project
  });
});

// POST /api/projects - Create a new project
app.post('/api/projects', (req, res) => {
  const {
    projectName,
    description,
    startDate,
    endDate,
    status,
    tasks,
    createdBy
  } = req.body;

  // Validate required fields
  if (!projectName || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Project name, start date, and end date are required'
    });
  }

  const newProject = {
    _id: generateId(),
    projectName,
    description: description || '',
    startDate,
    endDate,
    status: status || 'Planning',
    tasks: tasks || [],
    createdBy: createdBy || 'User',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  projects.push(newProject);
  
  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: newProject
  });
});

// PUT /api/projects/:id - Update a project
app.put('/api/projects/:id', (req, res) => {
  const projectIndex = projects.findIndex(p => p._id === req.params.id);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  const updatedProject = {
    ...projects[projectIndex],
    ...req.body,
    updatedAt: new Date()
  };

  projects[projectIndex] = updatedProject;

  res.json({
    success: true,
    message: 'Project updated successfully',
    data: updatedProject
  });
});

// DELETE /api/projects/:id - Delete a project
app.delete('/api/projects/:id', (req, res) => {
  const projectIndex = projects.findIndex(p => p._id === req.params.id);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  projects.splice(projectIndex, 1);
  
  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
});

// TASK ROUTES

// GET /api/tasks/:projectId - Get all tasks for a project
app.get('/api/tasks/:projectId', (req, res) => {
  const project = projects.find(p => p._id === req.params.projectId);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  res.json({
    success: true,
    count: project.tasks.length,
    data: project.tasks
  });
});

// POST /api/tasks/:projectId - Add a new task to a project
app.post('/api/tasks/:projectId', (req, res) => {
  const projectIndex = projects.findIndex(p => p._id === req.params.projectId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  const { id, name, start, end, progress, dependencies, custom_class } = req.body;

  // Validate required fields
  if (!id || !name || !start || !end) {
    return res.status(400).json({
      success: false,
      message: 'Task ID, name, start date, and end date are required'
    });
  }

  // Check if task ID already exists
  const existingTask = projects[projectIndex].tasks.find(task => task.id === id);
  if (existingTask) {
    return res.status(400).json({
      success: false,
      message: 'Task with this ID already exists'
    });
  }

  const newTask = {
    id,
    name,
    start,
    end,
    progress: progress || 0,
    dependencies: dependencies || [],
    custom_class: custom_class || ''
  };

  projects[projectIndex].tasks.push(newTask);
  projects[projectIndex].updatedAt = new Date();

  res.status(201).json({
    success: true,
    message: 'Task added successfully',
    data: newTask
  });
});

// PUT /api/tasks/:projectId/:taskId - Update a specific task
app.put('/api/tasks/:projectId/:taskId', (req, res) => {
  const projectIndex = projects.findIndex(p => p._id === req.params.projectId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  const taskIndex = projects[projectIndex].tasks.findIndex(task => task.id === req.params.taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Update task fields
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      projects[projectIndex].tasks[taskIndex][key] = req.body[key];
    }
  });

  projects[projectIndex].updatedAt = new Date();

  res.json({
    success: true,
    message: 'Task updated successfully',
    data: projects[projectIndex].tasks[taskIndex]
  });
});

// DELETE /api/tasks/:projectId/:taskId - Delete a specific task
app.delete('/api/tasks/:projectId/:taskId', (req, res) => {
  const projectIndex = projects.findIndex(p => p._id === req.params.projectId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  const taskIndex = projects[projectIndex].tasks.findIndex(task => task.id === req.params.taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Remove task from project
  projects[projectIndex].tasks.splice(taskIndex, 1);
  
  // Remove this task from other tasks' dependencies
  projects[projectIndex].tasks.forEach(task => {
    task.dependencies = task.dependencies.filter(dep => dep !== req.params.taskId);
  });

  projects[projectIndex].updatedAt = new Date();

  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Gantt Chart Generator API is running! (In-Memory Mode)',
    version: '1.0.0',
    mode: 'In-Memory Storage',
    endpoints: {
      projects: '/api/projects',
      tasks: '/api/tasks'
    },
    sampleData: {
      projects: projects.length,
      totalTasks: projects.reduce((sum, p) => sum + p.tasks.length, 0)
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Gantt Chart API available at http://localhost:${PORT}`);
  console.log(`💾 Running in IN-MEMORY mode (no database required)`);
  console.log(`📝 Sample data loaded with ${projects.length} project(s)`);
});

module.exports = app;
