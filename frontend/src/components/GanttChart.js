import React, { useState } from 'react';

const GanttChart = ({ tasks, onTaskUpdate }) => {
  const [viewMode, setViewMode] = useState('Day');

  if (!tasks || tasks.length === 0) {
    return (
      <div className="gantt-container">
        <div className="empty-state">
          <h3>No tasks to display</h3>
          <p>Add some tasks to see the Gantt chart</p>
        </div>
      </div>
    );
  }

  // Calculate date range for the chart
  const allDates = tasks.flatMap(task => [new Date(task.start), new Date(task.end)]);
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  
  // Generate date columns based on view mode
  const generateDateColumns = () => {
    const columns = [];
    const current = new Date(minDate);
    
    while (current <= maxDate) {
      columns.push(new Date(current));
      switch (viewMode) {
        case 'Day':
          current.setDate(current.getDate() + 1);
          break;
        case 'Week':
          current.setDate(current.getDate() + 7);
          break;
        case 'Month':
          current.setMonth(current.getMonth() + 1);
          break;
        default:
          current.setDate(current.getDate() + 1);
      }
    }
    return columns;
  };

  const dateColumns = generateDateColumns();

  // Calculate task bar width and position
  const calculateTaskBar = (task) => {
    const taskStart = new Date(task.start);
    const taskEnd = new Date(task.end);
    const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
    const startOffset = (taskStart - minDate) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24);
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    };
  };

  const formatDate = (date) => {
    switch (viewMode) {
      case 'Day':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'Week':
        return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'Month':
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      default:
        return date.toLocaleDateString();
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return '#e2e8f0';
    if (progress < 50) return '#ed8936';
    if (progress < 100) return '#667eea';
    return '#48bb78';
  };

  return (
    <div className="gantt-wrapper">
      <div className="gantt-controls" style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem', fontWeight: '500' }}>
          View Mode:
        </label>
        {['Day', 'Week', 'Month'].map(mode => (
          <button
            key={mode}
            className={`btn ${viewMode === mode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode(mode)}
            style={{ marginRight: '0.5rem' }}
          >
            {mode}
          </button>
        ))}
      </div>
      
      <div className="simple-gantt-container" style={{ 
        border: '1px solid #e2e8f0', 
        borderRadius: '10px', 
        background: 'white',
        overflowX: 'auto'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #e2e8f0', 
          backgroundColor: '#f7fafc',
          minWidth: '800px'
        }}>
          <div style={{ 
            width: '200px', 
            padding: '1rem', 
            fontWeight: 'bold',
            borderRight: '1px solid #e2e8f0'
          }}>
            Task Name
          </div>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            borderLeft: '1px solid #e2e8f0'
          }}>
            {dateColumns.map((date, index) => (
              <div 
                key={index}
                style={{ 
                  flex: 1, 
                  padding: '0.5rem', 
                  textAlign: 'center', 
                  fontSize: '0.8rem',
                  borderRight: index < dateColumns.length - 1 ? '1px solid #e2e8f0' : 'none',
                  minWidth: '60px'
                }}
              >
                {formatDate(date)}
              </div>
            ))}
          </div>
        </div>

        {/* Task Rows */}
        {tasks.map((task, taskIndex) => {
          const taskBarStyle = calculateTaskBar(task);
          
          return (
            <div 
              key={task.id}
              style={{ 
                display: 'flex', 
                borderBottom: taskIndex < tasks.length - 1 ? '1px solid #e2e8f0' : 'none',
                minHeight: '60px',
                alignItems: 'center',
                minWidth: '800px'
              }}
            >
              {/* Task Name Column */}
              <div style={{ 
                width: '200px', 
                padding: '1rem',
                borderRight: '1px solid #e2e8f0',
                fontSize: '0.9rem'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  {task.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {task.progress || 0}% complete
                </div>
                {task.dependencies && task.dependencies.length > 0 && (
                  <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>
                    Depends on: {task.dependencies.join(', ')}
                  </div>
                )}
              </div>

              {/* Timeline Column */}
              <div style={{ 
                flex: 1, 
                position: 'relative', 
                height: '40px',
                margin: '10px 0'
              }}>
                {/* Task Bar */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '24px',
                    backgroundColor: getProgressColor(task.progress),
                    borderRadius: '4px',
                    ...taskBarStyle,
                    minWidth: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  title={`${task.name}: ${new Date(task.start).toLocaleDateString()} - ${new Date(task.end).toLocaleDateString()}`}
                  onClick={() => {
                    if (onTaskUpdate) {
                      const newProgress = prompt(`Update progress for "${task.name}" (0-100):`, task.progress || 0);
                      if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
                        onTaskUpdate(task.id, { progress: parseInt(newProgress) });
                      }
                    }
                  }}
                >
                  {task.progress || 0}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        backgroundColor: '#f7fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Legend:</h4>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
            <span>Not Started (0%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#ed8936', borderRadius: '2px' }}></div>
            <span>In Progress (&lt;50%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#667eea', borderRadius: '2px' }}></div>
            <span>In Progress (≥50%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#48bb78', borderRadius: '2px' }}></div>
            <span>Completed (100%)</span>
          </div>
        </div>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#666' }}>
          Click on task bars to update progress
        </p>
      </div>
    </div>
  );
};

export default GanttChart;
