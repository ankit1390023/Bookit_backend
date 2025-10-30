# BookIt Backend

This is the backend service for the BookIt application, built with Node.js, Express, and MySQL using Sequelize ORM.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL (v8.0 or higher) or access to a MySQL database

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Bookit/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MYSQL_ADDON_URI=mysql://username:password@host:port/database
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
```

Replace the database connection string with your MySQL database credentials.

### 4. Database Setup

Make sure you have MySQL running and create a new database. Update the `MYSQL_ADDON_URI` in your `.env` file with your database credentials.

### 5. Run Database Migrations and Seed Data (Optional)

To seed the database with initial data:

```bash
npm run seed
```

## Running the Application

### Development Mode

```bash
npm run dev
```
This will start the server with nodemon for automatic reloading during development.

### Production Mode

```bash
npm start
```

## API Endpoints

The API will be available at `http://localhost:5000/api` by default.

## Project Structure

```
backend/
├── src/
│   ├── config/       # Database and other configurations
│   ├── controllers/  # Route controllers
│   ├── middlewares/  # Custom express middlewares
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── seeders/      # Database seed data
├── .env              # Environment variables
├── package.json      # Project dependencies and scripts
└── server.js         # Application entry point
```

## Dependencies

- Express.js - Web framework
- Sequelize - ORM for MySQL
- MySQL2 - MySQL client for Node.js
- CORS - Middleware for enabling CORS
- Helmet - Security middleware
- Dotenv - Environment variable management

## Development Dependencies

- Nodemon - Automatic server restart during development

## License

ISC
