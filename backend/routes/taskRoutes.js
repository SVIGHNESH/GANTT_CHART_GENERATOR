const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET /api/tasks/:projectId - Get all tasks for a project
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
});

// POST /api/tasks/:projectId - Add a new task to a project
router.post('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
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
    const existingTask = project.tasks.find(task => task.id === id);
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

    project.tasks.push(newTask);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Task added successfully',
      data: newTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding task',
      error: error.message
    });
  }
});

// PUT /api/tasks/:projectId/:taskId - Update a specific task
router.put('/:projectId/:taskId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const taskIndex = project.tasks.findIndex(task => task.id === req.params.taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update task fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        project.tasks[taskIndex][key] = req.body[key];
      }
    });

    await project.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: project.tasks[taskIndex]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
});

// DELETE /api/tasks/:projectId/:taskId - Delete a specific task
router.delete('/:projectId/:taskId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const taskIndex = project.tasks.findIndex(task => task.id === req.params.taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Remove task from project
    project.tasks.splice(taskIndex, 1);
    
    // Remove this task from other tasks' dependencies
    project.tasks.forEach(task => {
      task.dependencies = task.dependencies.filter(dep => dep !== req.params.taskId);
    });

    await project.save();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
});

// GET /api/tasks/:projectId/:taskId - Get a specific task
router.get('/:projectId/:taskId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const task = project.tasks.find(task => task.id === req.params.taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
});

module.exports = router;
