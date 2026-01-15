import express from "express"
import cors from "cors"
import { PORT } from "./config/env"
import { router } from "./routes"
import { authMiddleware } from "./middlewares/auth"
import { initProducer } from "./kafka/producer"
const app = express()

app.use(express.json())
app.use(cors())
app.use("/v1/events", authMiddleware, router)

async function startServer() {
    try {
        await initProducer();

        app.listen(PORT, () => {
            console.log(`Server started at port ${PORT}`)
        })

    } catch(er: any) {
        console.log(`An error occured while starting server ${er}`)
    }
}

startServer();