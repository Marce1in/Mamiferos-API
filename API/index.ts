import express from "express";
import mammalsRouter from "./routes/mammals"

const app = express()
const port = 3000

app.use(express.json())
app.use("/mammals", mammalsRouter)

app.get("/", (_, res) => {
    res.send("Mammals Avenida")
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
})
