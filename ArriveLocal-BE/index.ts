require('dotenv').config();
const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
import { decode } from "punycode";
const  cookieParser = require("cookie-parser");
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

// Global middleware (runs for all requests)
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());
app.use(cors(corsOptions));
// CORS middleware for development

// Custom middleware
app.use((req: any, res: any, next: any) => {
  console.log(`${req.method} ${req.path}`);
  next(); // Continue to next middleware
});

// Auth routes (handling all routing requests for auth)
app.use('/auth/login', require('./routes/auth/login.ts'));
app.use('/auth/register', require('./routes/auth/register'));
app.use('/auth/logout', require('./routes/auth/logout'));
app.use('/auth/refresh', require('./routes/auth/refresh'));
app.use('/auth/me', require('./routes/auth/me')); // New /auth/me endpoint

// User routes Dummy routes for testing
app.route("/")
  .get((req: any, res: any) => {
    res.json({ message: "Get user" });
  });

app.param("id", (req: any, res: any, next: any, id: any) => {
  // Validate or process the id parameter
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  next();
});

const userRouter = express.Router();
userRouter.get("/", (req: any, res: any) => res.json({ users: ["Ram", "shyam", "Hony"] }));
userRouter.post("/", (req: any, res: any) => res.json({ message: "User created" }));

app.use("/api/users", userRouter);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  console.log("Error: ", err.message);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error or route not found'
  });
});

// 404 handler (use pathless handler to avoid path-to-regexp wildcard issue )
app.use((req: any, res: any) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `The requested route ${req.method} ${req.originalUrl} does not exist`
  });
});

app.set("view engine", "ejs");
app.set("views", "./views");
app.set("port", process.env.PORT || 3000);

const port = app.get("port");
const viewEngine = app.get("view engine");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`View engine: ${viewEngine}`);
});
