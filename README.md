# 🚀 Project Manager - AI-Powered Kanban Board

A modern, full-stack project management application with AI-powered insights, built with React, Node.js, and Gemini AI integration.

## ✨ Features

### 🎯 Core Project Management
- **Project Creation & Management**: Create, edit, and delete projects with detailed descriptions
- **Task Management**: Add tasks with titles and descriptions using a professional modal interface
- **Kanban Board**: Drag-and-drop task management across three status columns:
  - 📝 **To Do**: New tasks ready to be started
  - ⚡ **In Progress**: Tasks currently being worked on
  - 🎉 **Done**: Completed tasks

### 🤖 AI-Powered Features
- **Executive Summary**: Generate comprehensive project insights using Gemini AI
  - Project overview and current status
  - Task distribution analysis
  - Key insights and recommendations
  - Risk assessment and next steps
- **Task Q&A**: Ask questions about specific tasks and get AI-powered answers
  - Context-aware responses
  - Task-specific recommendations
  - Intelligent insights based on task details

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Drag & Drop**: Intuitive task movement between columns
- **Real-time Updates**: Instant state synchronization
- **Custom Scrollbars**: Enhanced scrolling experience for task columns
- **Professional Modals**: Task creation with form validation

### 🔧 Technical Features
- **Full-Stack Architecture**: React frontend with Node.js/Express backend
- **Database Integration**: MongoDB for data persistence
- **AI Integration**: Google Gemini AI for intelligent insights
- **Error Handling**: Graceful fallbacks when backend is unavailable
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Context API for global state

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Styled Components** for styling
- **@hello-pangea/dnd** for drag-and-drop functionality
- **Axios** for API communication
- **React Context API** for state management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Google Gemini AI** integration
- **CORS** enabled for cross-origin requests

### AI & External Services
- **Google Gemini AI** for intelligent insights
- **MongoDB Atlas** for cloud database
- **Environment-based configuration**

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-manager
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/project-manager
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Get Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key
   - Replace `your_gemini_api_key_here` in the `.env` file

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd client
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Usage Guide

### Creating Projects
1. Click "Add New Project" in the sidebar
2. Enter project name and description
3. Click "Create Project" to save

### Managing Tasks
1. Select a project from the sidebar
2. Click "➕ Add New Task" button
3. Fill in task title and description
4. Click "Create Task" to add to "To Do" column

### Using AI Features
1. **Executive Summary**: Click "Generate Summary" to get AI-powered project insights
2. **Task Q&A**: Click on any task card, then use the Q&A section to ask questions

### Drag & Drop Tasks
- Drag tasks between columns to update their status
- Tasks automatically move between "To Do", "In Progress", and "Done"

## 🎯 Key Features in Detail

### AI-Powered Executive Summary
- **Comprehensive Analysis**: Get detailed insights about your project
- **Task Distribution**: See how tasks are spread across different statuses
- **Progress Tracking**: Understand completion percentages
- **Recommendations**: Receive AI-generated suggestions for improvement
- **Risk Assessment**: Identify potential blockers and challenges

### Intelligent Task Q&A
- **Context-Aware**: AI understands your specific task details
- **Smart Recommendations**: Get actionable advice for task completion
- **Resource Planning**: Understand what you need to complete tasks
- **Timeline Insights**: Get guidance on task prioritization

### Responsive Kanban Board
- **Mobile-Friendly**: Works perfectly on all screen sizes
- **Smooth Animations**: Professional drag-and-drop interactions
- **Custom Scrollbars**: Enhanced scrolling for long task lists
- **Visual Feedback**: Clear status indicators and progress tracking

## 🔧 Configuration

### Environment Variables
```env
MONGO_URI=mongodb://localhost:27017/project-manager
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_actual_gemini_api_key
```

### Database Setup
- **Local MongoDB**: Install MongoDB locally and update `MONGO_URI`
- **MongoDB Atlas**: Use cloud database for production deployment

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build

```

### Backend Deployment
```bash
cd server
npm run build

```

Deployment Link - https://project-management-38df.vercel.app/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


