# Kanban Tasks Management App

This is a Kanban-style task management application built with Next.js. The app allows users to create, read, update, and delete tasks, and organize them into different columns representing various stages of a process.

## Features

- Responsive design for optimal viewing on different devices
- Create, read, update, and delete boards
- Create, read, update, and delete tasks
- Drag and drop tasks between columns
- User authentication and token management
- API integration for data persistence
- Middleware for handling authentication and API requests

## Areas of Improvement

- **Modal Overflow Handling**: The current modal implementation has issues with overflow. Absolute positioned elements within the modal cause it to scroll internally instead of allowing the content to overflow outside. This makes the modal less user-friendly when dealing with large content.

## Live Demo

Check out the live frontend of the Kanban Task Management app here [live-frontend-link].

## Backend Repository

The backend for this application is available here. It provides the API endpoints consumed by the frontend for data persistence and user authentication [[backend repo](https://github.com/Plut0r/kanban-task-management-api)].

