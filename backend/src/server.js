// require("dotenv").config({
//    path: "./env"
// })
// app.use() mostly used in middleware and config settings
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV || "development";
//  whenn call this function automatically connect DB with mongoose

// throw error when app does not listen properly

// app.on("error", (error) => {
//   console.log("Express App does not properly listen:", error);
//   throw error;
// });

// load env variables
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      // console.log(`Application environment mode:${ENVIRONMENT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB cannot connnected try again!!", err);
  });

/*
import mongoose from "mongoose"
// import { DB_NAME } from "./constants"
import express from "express"
const app = express()  // craete an express Object from express package

const connectDB = async ()=>{

try {
     await mongoose.connect(`CONNECT DB: ${process.env.MONGODB_URL}/${DB_NAME}`)
     app.on("error",(error)=>{
        console.log("EXPRESS CANNOT COMMUNICATE WITH MONGODB!!", error)
        throw error
     })
     app.listen(process.env.PORT,()=>{
        console.log(`Server running on http://localhost:${process.env.PORT}`)
     })
} catch (error) {
    console.log("ERROR OCCURS", error) 
    throw error   
}

}

connectDB()
*/
