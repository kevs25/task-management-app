# Task Management App

A Task Management App built with React, Firebase, and TypeScript to help users manage their tasks efficiently. The app supports features like adding tasks, editing tasks, bulk deletion, and changing task statuses. It leverages Firebase for backend operations and state management to ensure smooth user interactions.

# Deployment URL: https://your-task-management.netlify.app/

## Features

- **Add Tasks**: Users can create new tasks under specific sections.
- **Edit TasksDeleteTasks**: Modify the details of existing tasks.
- **Bulk Operations**: Select multiple tasks to delete or update their status at once.
- **Drag and Drop**: Reorganize tasks using a drag-and-drop interface.
- **Firebase Integration**: Tasks are stored and managed using Firebase Firestore.
- **User Authentication**: Secure access for each user to manage their own tasks.
- **Fitlering** : Filter tasks by searching the title, using category work or personal, filter by date
- **Sorting** : Sort task by due date (ascending or descending)
- **List View** : Users can view the task as in list view with drag and drop functionality
- **Board View** : Users can view the task in board view (Kanban-style)

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS (for styling)
  - DnD Kit (for drag-and-drop functionality)

- **Backend**:
  - Firebase Firestore (for database management)
  - Firebase Authentication

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (>=16.x)
- npm or yarn
- Firebase account with Firestore and Authentication enabled

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-management-app.git
   cd task-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Firebase:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project.
   - Enable Firestore and Authentication.
   - Copy the Firebase configuration.

4. Create a `.env` file in the root directory and add the following:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   ```

5. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

6. Open the app in your browser:
   ```
   http://localhost:3000
   ```

