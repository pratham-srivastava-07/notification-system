import express from "express"
import cors from "cors"
import { PORT } from "./config/env"
import { router } from "./routes"
import { authMiddleware } from "./middlewares/auth"

const app = express()

app.use(express.json())
app.use(cors())
app.use("/v1/events", authMiddleware, router)

app.listen(PORT, () => {
    console.log(`Ingestion service started on port ${PORT}`)
})