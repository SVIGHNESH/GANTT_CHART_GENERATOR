# Gantt Chart Generator - MERN Stack

A comprehensive Gantt chart generator built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to create, manage, and visualize projects with interactive Gantt charts.

## 🚀 Features

- **Project Management**: Create, update, and delete projects
- **Task Management**: Add, edit, and remove tasks with dependencies
- **Interactive Gantt Charts**: Visualize project timelines with drag-and-drop functionality
- **Progress Tracking**: Monitor task and project completion status
- **Multiple View Modes**: Day, Week, Month views for better project visualization
- **Task Dependencies**: Set up task relationships and dependencies
- **Real-time Updates**: Live updates when tasks are modified
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling

### Frontend
- **React.js** - Frontend library
- **Frappe Gantt** - Gantt chart visualization
- **Axios** - HTTP client
- **CSS3** - Styling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GANTT-CHART-GENERATOR
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/gantt-generator
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For macOS (with Homebrew)
brew services start mongodb-community

# For Linux
sudo systemctl start mongod

# For Windows
net start MongoDB
```

### 5. Run the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

#### Start Frontend Application
```bash
cd frontend
npm start
```
The frontend application will start on `http://localhost:3000`

## 📁 Project Structure

```
GANTT-CHART-GENERATOR/
├── backend/
│   ├── models/
│   │   └── Project.js          # MongoDB schema
│   ├── routes/
│   │   ├── projectRoutes.js    # Project API routes
│   │   └── taskRoutes.js       # Task API routes
│   ├── middleware/             # Custom middleware
│   ├── .env                    # Environment variables
│   ├── server.js              # Express server setup
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── GanttChart.js   # Gantt chart component
│   │   │   ├── ProjectList.js  # Project listing
│   │   │   ├── ProjectForm.js  # Project creation form
│   │   │   └── TaskEditor.js   # Task management
│   │   ├── services/
│   │   │   └── projectService.js # API service layer
│   │   ├── App.js              # Main application component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   └── package.json
└── README.md
```

## 🎯 Usage

### Creating a Project
1. Click "New Project" button
2. Fill in project details (name, description, dates)
3. Click "Create Project"

### Managing Tasks
1. Select a project from the project list
2. Click "Add Task" to create new tasks
3. Set task details including:
   - Task name and ID
   - Start and end dates
   - Progress percentage
   - Dependencies (other task IDs)

### Viewing Gantt Chart
1. Select a project with tasks
2. View the interactive Gantt chart
3. Switch between different view modes (Day, Week, Month)
4. Drag tasks to update dates
5. Click on tasks to see details

### Updating Tasks
- **Via Task Editor**: Edit tasks using the form interface
- **Via Gantt Chart**: Drag tasks to change dates or progress

## 🌐 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/progress` - Get project progress

### Tasks
- `GET /api/tasks/:projectId` - Get all tasks for a project
- `GET /api/tasks/:projectId/:taskId` - Get specific task
- `POST /api/tasks/:projectId` - Add task to project
- `PUT /api/tasks/:projectId/:taskId` - Update task
- `DELETE /api/tasks/:projectId/:taskId` - Delete task

## 🎨 Sample Data Structure

### Project
```json
{
  "projectName": "Website Launch",
  "description": "Complete website redesign and launch",
  "startDate": "2025-08-18",
  "endDate": "2025-09-15",
  "status": "In Progress",
  "tasks": [
    {
      "id": "task_1",
      "name": "Design Phase",
      "start": "2025-08-18",
      "end": "2025-08-25",
      "progress": 80,
      "dependencies": []
    },
    {
      "id": "task_2",
      "name": "Development",
      "start": "2025-08-26",
      "end": "2025-09-10",
      "progress": 30,
      "dependencies": ["task_1"]
    }
  ]
}
```

## 🚀 Deployment

### Backend Deployment (Heroku/Render)
1. Set environment variables on your hosting platform
2. Deploy backend code
3. Update MongoDB connection string for production

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the build folder
3. Set environment variable: `REACT_APP_API_URL=your-backend-url`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file

2. **CORS Errors**
   - Verify backend CORS configuration
   - Check API URL in frontend

3. **Gantt Chart Not Displaying**
   - Ensure tasks have valid date formats
   - Check browser console for errors

4. **Port Already in Use**
   - Change port in backend `.env` file
   - Kill existing processes: `lsof -ti:5000 | xargs kill -9`

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review console logs for error details

---

**Built with ❤️ using the MERN Stack**
