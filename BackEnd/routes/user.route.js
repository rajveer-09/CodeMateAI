import express from "express";
import { createUser, loginUser, logoutUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
