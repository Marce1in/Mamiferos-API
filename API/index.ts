import express from "express";

const app = express()
const port = 3000

app.use(express.json())

app.get("/", (_, req) => {
    req.send("Mammals Avenida")
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
})
