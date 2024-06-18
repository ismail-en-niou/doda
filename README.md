# To-Do List Project

This project is a to-do list application that includes a back-end system for user authentication and task management. The back-end services are powered by Firebase, providing secure and reliable storage for user data and tasks.

## Features

1. **User Authentication:**
   - **Registration:** Users can create a new account using their email and password.
   - **Login:** Registered users can log in to access their tasks.
   - **Logout:** Users can log out of their accounts securely.

2. **Task Management:**
   - **Add Task:** Users can add new tasks to their to-do list.
   - **Edit Task:** Users can update existing tasks.
   - **Delete Task:** Users can remove tasks from their list.
   - **View Tasks:** Users can view all their tasks in a list format.

## Technology Stack

- **Front-end:**
  - HTML, CSS, JavaScript
  - Frameworks/Libraries: React or Angular (optional)

- **Back-end:**
  - Firebase Authentication for user login and registration.
  - Firebase Firestore for storing and retrieving tasks.

## Setup Instructions

### Firebase Setup

1. Create a Firebase project at the [Firebase Console](https://console.firebase.google.com/).
2. Enable Firebase Authentication and Firestore for your project.
3. Obtain the Firebase configuration object from the Firebase Console and add it to your project.

### Front-end Setup

1. Initialize your project with your preferred front-end framework.
2. Install Firebase SDK:
   ```bash
   npm install firebase
