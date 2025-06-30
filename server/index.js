// index.js
const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./config/database");
const userRouter = require("./routes/User.routes.js")

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL;

// Connect to MongoDB
dbConnection(MONGODB_URL);

// Middleware to parse JSON
app.use(express.json());

app.use("/auth",userRouter)

// Sample route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
