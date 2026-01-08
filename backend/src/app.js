import express from "express";
import cors from "cors";
import cookie_parser from "cookie-parser";

export const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); // app.use in middleware and config settings most of the times

app.use(
  express.json({
    limit: "20KB",
  })
); // means my server accepting JSON DATA or allow JSON

app.use(
  express.urlencoded({
    extended: true,
    limit: "20KB",
  })
); // means my server accepting data from URL extended means nested OBJECT

app.use(express.static("public"));
app.use(cookie_parser()); // server acess user browser access cookies and set cookies securly and safely

app.get("/", (req, res) => {
  // this is my root route
  res.json({
    success: true,
    message: "Stremify API is Working.",
    version: "1.0.0",
  });
});

// imports the routes from routes folder
import userRoutes from "./routes/user.route.js";

// Route used as Middleware
//declaration for routes
app.use("/api/v1/users", userRoutes); // user routes

// http://localhost:5000/api/v1/users/register
// app.use((err, req, res, next) => {
//   const statusCode = err.code || err.statusCode || 500;

//   res.status(statusCode).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });
