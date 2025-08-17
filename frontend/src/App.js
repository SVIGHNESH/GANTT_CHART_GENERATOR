import React, { useState, useCallback } from 'react';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import TaskEditor from './components/TaskEditor';
import GanttChart from './components/GanttChart';
import { projectService, taskService } from './services/projectService';
import './index.css';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Force refresh of project list
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Handle project selection
  const handleProjectSelect = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  // Handle new project creation
  const handleProjectCreated = useCallback((newProject) => {
    triggerRefresh();
    setSelectedProject(newProject);
  }, [triggerRefresh]);

  // Handle task updates and refresh project data
  const handleTasksUpdate = useCallback(async () => {
    if (selectedProject) {
      try {
        const updatedProject = await projectService.getProject(selectedProject._id);
        setSelectedProject(updatedProject);
        triggerRefresh();
      } catch (error) {
        console.error('Error refreshing project:', error);
      }
    }
  }, [selectedProject, triggerRefresh]);

  // Handle individual task updates from Gantt chart
  const handleTaskUpdate = useCallback(async (taskId, updates) => {
    if (selectedProject) {
      try {
        await taskService.updateTask(selectedProject._id, taskId, updates);
        handleTasksUpdate();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  }, [selectedProject, handleTasksUpdate]);

  return (
    <div className="App">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>Gantt Chart Generator</h1>
          <p>Manage projects and visualize tasks with interactive Gantt charts</p>
        </header>

        {/* Project Creation Form */}
        <ProjectForm onProjectCreated={handleProjectCreated} />

        {/* Project List */}
        <ProjectList 
          onProjectSelect={handleProjectSelect}
          selectedProject={selectedProject}
          key={refreshTrigger} // Force re-render when refresh is triggered
        />

        {/* Selected Project Details */}
        {selectedProject && (
          <>
            {/* Task Editor */}
            <TaskEditor 
              project={selectedProject}
              onTasksUpdate={handleTasksUpdate}
            />

            {/* Gantt Chart */}
            <div className="section">
              <h2>Gantt Chart Visualization</h2>
              <GanttChart 
                tasks={selectedProject.tasks}
                onTaskUpdate={handleTaskUpdate}
              />
            </div>

            {/* Project Summary */}
            <div className="section">
              <h2>Project Summary</h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem' 
              }}>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f7fafc', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>Total Tasks</h3>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#2d3748' }}>
                    {selectedProject.tasks ? selectedProject.tasks.length : 0}
                  </p>
                </div>

                <div style={{ 
                  padding: '1rem', 
                  background: '#f7fafc', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#48bb78' }}>Completed Tasks</h3>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#2d3748' }}>
                    {selectedProject.tasks ? 
                      selectedProject.tasks.filter(task => task.progress === 100).length : 0}
                  </p>
                </div>

                <div style={{ 
                  padding: '1rem', 
                  background: '#f7fafc', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#ed8936' }}>In Progress</h3>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#2d3748' }}>
                    {selectedProject.tasks ? 
                      selectedProject.tasks.filter(task => task.progress > 0 && task.progress < 100).length : 0}
                  </p>
                </div>

                <div style={{ 
                  padding: '1rem', 
                  background: '#f7fafc', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#718096' }}>Not Started</h3>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#2d3748' }}>
                    {selectedProject.tasks ? 
                      selectedProject.tasks.filter(task => task.progress === 0).length : 0}
                  </p>
                </div>
              </div>

              {/* Overall Progress */}
              <div style={{ marginTop: '2rem' }}>
                <h3>Overall Project Progress</h3>
                <div className="progress-bar" style={{ height: '30px' }}>
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${selectedProject.tasks && selectedProject.tasks.length > 0 
                        ? Math.round(selectedProject.tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / selectedProject.tasks.length)
                        : 0}%`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {selectedProject.tasks && selectedProject.tasks.length > 0 
                      ? Math.round(selectedProject.tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / selectedProject.tasks.length)
                      : 0}%
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <footer style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          textAlign: 'center', 
          color: '#718096',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p>Gantt Chart Generator - Built with MERN Stack (MongoDB, Express, React, Node.js)</p>
          <p>Features: Project Management | Task Dependencies | Progress Tracking | Interactive Gantt Charts</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
