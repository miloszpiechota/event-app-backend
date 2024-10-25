import express from "express"
import { rateLimit } from "express-rate-limit"
import { UsersCreate, UsersRead, UsersLogin, UsersUpdate, UsersDelete, UserAuth } from "../controllers/UsersControllers"
const users_controllers = express.Router()


const LimitLogin = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 10,
 standardHeaders: true,
 legacyHeaders: false,
 message: "Pressing the screen too much, please wait a little longer up to 15 minutes !!",
})

//      CREATE USER ROUTES
users_controllers.post("/create", UsersCreate)
users_controllers.post("/login", UsersLogin, LimitLogin)
users_controllers.post("/read", UsersRead)

users_controllers.put("/update/:id", UsersUpdate)
users_controllers.delete("/delete/:id", UsersDelete)
users_controllers.get("/auth", UserAuth)

//te fukcje są aby sobie były, jak ci przeszkadzają to je usuń
users_controllers.get("/hello", (req, res) => {
 res.send("Hello World")})
users_controllers.get("/lorem",(req,res)=>{
    res.send("Lorem ipsum dolor sit amet...")
})


export default users_controllers