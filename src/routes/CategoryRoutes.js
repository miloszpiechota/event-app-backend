import express from "express"
import {CategoryRead, CategoryReadById} from "../controllers/CategoryControllers"
const category_routes = express.Router()
import { authCheck } from "../middlewares/AuthCheck"
const checkPermission = require('../middlewares/checkPermission');

category_routes.get("/read", CategoryRead)
category_routes.get("/read/:id", CategoryReadById)

export default category_routes
