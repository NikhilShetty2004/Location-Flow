const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

// Create express app
const app = express();

// dotenv config
dotenv.config();

// Enable CORS
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "*", "http://localhost:8800"],
  })
);

// Parse JSON bodies
app.use(express.json());

//initialize the port-Enter a port
const port = process.env.PORT || 5000;

/*db connection
MONGO_URL - Enter the DB url '*/
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Terminate the application if unable to connect MongoDB
    process.exit(1);
  });

// API Routes
app.use("/api/pins", pinRoute);
app.use("/api/user", userRoute);

app.listen(port, () => {
  console.log("Backend is Running");
});
