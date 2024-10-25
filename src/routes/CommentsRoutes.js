import express from "express";
import { CommentsCreate, CommentsRead, CommentsDelete } from "../controllers/CommentsControllers";
const comments_controllers = express.Router();

// CREATE COMMENTS ROUTES
comments_controllers.post("/create", CommentsCreate);
comments_controllers.get("/read", CommentsRead);
comments_controllers.delete("/delete/:id", CommentsDelete);

export default comments_controllers;