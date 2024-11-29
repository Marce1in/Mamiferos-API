import { PrismaClient, Subclass, Habitat, Diet } from "@prisma/client";
import { Router } from "express";
import { z } from "zod"
import { checkToken } from "../middlewares/checkToken";

const router = Router()
const prisma = new PrismaClient()

const mammalsSchema = z.object({
    species: z.string(),
    subclass: z.nativeEnum(Subclass),
    habitat: z.nativeEnum(Habitat),
    diet: z.nativeEnum(Diet)
})

router.get("/", async(_, res) => {
    try {
        const mammals = await prisma.mammals.findMany({
            where: {
                deleted: false
            },

            select: {
                id: true,
                diet: true,
                habitat: true,
                species: true,
                subclass: true
            }
        })

        res.status(200).json(mammals)
    } catch (error) {
        res.status(500).json({error: error})
    }

})

router.get("/:id", async(req, res) => {
    const { id } = req.params
    try {
        const mammal = await prisma.mammals.findUnique({
            where: {
                id: Number(id)
            },

            select: {
                id: true,
                diet: true,
                habitat: true,
                species: true,
                subclass: true
            }
        })

        res.status(200).json(mammal)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.post("/", checkToken, async(req, res) => {
    const result = mammalsSchema.safeParse(req.body)

    if(!result.success){
        res.status(400).json({error: result.error})
        return
    }

    try {
        const mammal = await prisma.mammals.create({
            //@ts-ignore
            data: {...result.data, userId: req.userLoggedId},

            select: {
                id: true,
                diet: true,
                habitat: true,
                species: true,
                subclass: true
            }
        })

        res.status(201).json(mammal)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.delete("/:id", checkToken, async(req, res) => {
    const { id } = req.params

    try {
        const mammal = await prisma.mammals.update({
            where: { id: Number(id) },
            data: { deleted: true },

            select: {
                id: true,
                diet: true,
                habitat: true,
                species: true,
                subclass: true
            }
        })

        res.status(201).json(mammal)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.put("/:id", checkToken, async(req, res) => {
    const { id } = req.params
    const result = mammalsSchema.safeParse(req.body)

    if(!result.success){
        res.status(400).json({error: result.error})
        return
    }

    try {
        const mammal = await prisma.mammals.update({
            where: { id: Number(id) },
            data: result.data,

            select: {
                id: true,
                diet: true,
                habitat: true,
                species: true,
                subclass: true
            }
        })

        res.status(201).json(mammal)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

export default router
