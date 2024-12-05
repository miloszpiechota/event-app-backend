import express from "express"
import cors from "cors"
import env from "dotenv"
import path from "path"
import helmet from "helmet"
env.config()
require('dotenv').config();

const app = express()
const PORT = process.env.PORT;
import Routes from "./routes/Routes";



//  MIDDLEWARE
app.use((req, res, next) => {
 // WEBSITE YOU WISH TO ALLOW TO CONNECT
 req.headers["Access-control-allow-origin"] = "*"

 // REQUEST METHOD YOU WISH TO ALLOW
 req.headers["Access-control-allow-methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"

 // REQUEST HEADERS YOU WISH TO ALLOW
 req.headers["Access-control-allow-headers"] = "Content-Type, Authorization"

 // PASS TO NEXT LAYER OF MIDDLEWARE
 next()
})

app.use(
 cors({
  origin: "*",
 })
)

app.use(
 helmet({
  crossOriginResourcePolicy: false,
 })
)

app.use(express.json({ limit: "100mb" }))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "../static")))

//  ROUTES

app.use("/api", Routes)

//  LISTENER
app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
  });