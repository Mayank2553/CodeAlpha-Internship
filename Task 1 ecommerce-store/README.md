# E-Commerce Store

A basic e-commerce website built with Express.js and MongoDB.

## Features

- Product listings
- Shopping cart
- User authentication
- Order processing
- Responsive design

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

3. Start the server:
```bash
npm start
```

4. For development with hot reloading:
```bash
npm run dev
```

## Project Structure

- `/models` - Database models (Product, User, Order)
- `/public` - Frontend files (HTML, CSS, JS)
- `server.js` - Main server file
- `package.json` - Project dependencies

## Technologies Used

- Backend: Express.js, Node.js, MongoDB
- Frontend: HTML5, CSS3, JavaScript
- Authentication: JWT
- Database: MongoDB
