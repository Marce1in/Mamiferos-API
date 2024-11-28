import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod"

const router = Router()
const prisma = PrismaClient

router.get("/", async() => {

})

router.get("/:id", async() => {

})

router.post("/", async() => {

})

router.delete("/", async() => {

})

router.put("/", async() => {

})

export default router
