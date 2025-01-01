import express from "express";
import { CommentsCreate, CommentsRead, CommentsDelete } from "../controllers/CommentsControllers";
const comments_routes = express.Router();

// CREATE COMMENTS ROUTES
comments_routes.post("/create", CommentsCreate);
comments_routes.get("/read", CommentsRead);
comments_routes.delete("/delete/:id", CommentsDelete);

export default comments_routes;