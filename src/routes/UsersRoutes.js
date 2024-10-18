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
users_controllers.post("/users/create", UsersCreate)
users_controllers.post("/users/login", UsersLogin, LimitLogin)
users_controllers.post("/users/read", UsersRead)
users_controllers.put("/users/update/:id", UsersUpdate)
users_controllers.delete("/users/delete", UsersDelete)
users_controllers.get("/users/auth", UserAuth)


export default users_controllers