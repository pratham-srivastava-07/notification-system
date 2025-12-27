import express from "express"
import mainController from "../controllers"

export const router = express.Router()

router.post("/", mainController)