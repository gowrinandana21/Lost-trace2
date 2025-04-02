const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const missingPersonRoutes = require("./routes/missingPerson")
const familyRoutes = require("./routes/family")
const reportRoutes = require("./routes/report")
const userRoutes = require("./routes/user")
const officerRoutes = require("./routes/officer")

// Initialize express app
const app = express()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Middleware
//app.use(helmet()) // Set security HTTP headers
app.use(morgan("dev")) // Logging
app.use(cors()) // Enable CORS
app.use(express.json({ limit: "10kb" })) // Body parser, reading data from body into req.body

// Comment out these temporarily:
// app.use(mongoSanitize())
// app.use(xss())
// app.use("/api", limiter)
// app.use(helmet())

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize())

// Data sanitization against XSS
//app.use(xss())

// Rate limiting
// const limiter = rateLimit({
//   max: 100, // 100 requests from same IP
//   windowMs: 60 * 60 * 1000, // 1 hour
//   message: "Too many requests from this IP, please try again in an hour!",
// })
// app.use("/api", limiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/missing-persons", missingPersonRoutes)
app.use("/api/family", familyRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/users", userRoutes)
app.use("/api/officers", officerRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)

  const statusCode = err.statusCode || 500
  const status = err.status || "error"

  res.status(statusCode).json({
    status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
})

// 404 handler for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...")
  console.error(err.name, err.message)
  process.exit(1)
})

