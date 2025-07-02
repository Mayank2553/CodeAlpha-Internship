# Video Conferencing & Collaboration Tool

A modern video conferencing application with real-time collaboration features.

## Features

- Multi-user video calling using WebRTC
- Screen sharing capability
- Real-time whiteboard for drawing/writing
- File sharing functionality
- Secure user authentication
- End-to-end encryption for data

## Tech Stack

- Frontend: React, Material-UI, Socket.IO Client
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB
- Real-time Communication: WebRTC

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:3000
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

The application will be available at `http://localhost:3000`

## Security Features

- JWT-based authentication
- HTTPS enforcement
- CORS protection
- Rate limiting
- Input validation
- Secure password hashing

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
