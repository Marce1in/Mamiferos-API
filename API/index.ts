import express from "express";
import mammalsRouter from "./routes/mammals"
import userRouter from "./routes/user"

const app = express()
const port = 3000

app.use(express.json())
app.use("/mammals", mammalsRouter)
app.use("/user", userRouter)

app.get("/", (_, res) => {
    res.send("Mammals Avenida")
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
})
