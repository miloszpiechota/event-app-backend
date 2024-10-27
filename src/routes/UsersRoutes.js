import express from "express"
import { rateLimit } from "express-rate-limit"
import { UsersCreate, UsersRead, UserRead, UsersLogin, UsersUpdate, UsersDelete, UserAuth } from "../controllers/UsersControllers"
import { authCheck } from "../middlewares/AuthCheck"
const users_controllers = express.Router()
import { checkPermission } from "../middlewares/rbacMiddleware"; // Adjust the path as necessary

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
users_controllers.post("/read", authCheck, checkPermission('users','read'), UsersRead)    //read all users
users_controllers.post("/read/:id",authCheck, checkPermission('users','read_self'), UserRead)  //read specific user
users_controllers.post("/admin/read/:id",authCheck, checkPermission('users','read'), UserRead)  //read specific user

users_controllers.put("/update/:id", authCheck, checkPermission('users','update_self'), UsersUpdate)
users_controllers.delete("/delete/:id", authCheck, checkPermission('users','delete'), UsersDelete)
users_controllers.get("/auth", UserAuth)

//te fukcje są aby sobie były, jak ci przeszkadzają to je usuń
users_controllers.get("/hello", (req, res) => {
 res.send("Hello World")})
users_controllers.get("/lorem",(req,res)=>{
    res.send("Lorem ipsum dolor sit amet...")
})
export default users_controllers