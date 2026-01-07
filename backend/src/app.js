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
