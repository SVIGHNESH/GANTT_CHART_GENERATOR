const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  dependencies: [{
    type: String,
    ref: 'Task'
  }],
  custom_class: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    default: 'Planning'
  },
  tasks: [taskSchema],
  createdBy: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true
});

// Add validation to ensure endDate is after startDate
projectSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Add method to calculate project progress
projectSchema.methods.calculateProgress = function() {
  if (this.tasks.length === 0) return 0;
  
  const totalProgress = this.tasks.reduce((sum, task) => sum + task.progress, 0);
  return Math.round(totalProgress / this.tasks.length);
};

module.exports = mongoose.model('Project', projectSchema);
