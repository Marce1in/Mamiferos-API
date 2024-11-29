import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { z } from "zod"

const router = Router()
const prisma = new PrismaClient()

const userSchema = z.object({
    name: z.string(),
    email: z.string(),
    passwd: z.string(),
})
const newPasswdSchema = z.object({
    name: z.string(),
    email: z.string(),
    passwd: z.string(),
    newpasswd: z.string()
})

function validatePasswd(passwd: string) {

    const msgs: string[] = []

    if (passwd.length < 8)
        msgs.push("Error: the password need to be long than 8 characters")

    let small = 0, big = 0, nums = 0, simbols = 0

    for (const letter of passwd) {
        if ((/[a-z]/).test(letter)) {
            small++
        }
        else if ((/[A-Z]/).test(letter)) {
            big++
        }
        else if ((/[0-9]/).test(letter)) {
            nums++
        } else {
            simbols++
        }
    }

    if (small == 0) {
        msgs.push("Error: password must contain lowercase letter(s)");
    }

    if (big == 0) {
        msgs.push("Error: password must contain uppercase letter(s)");
    }

    if (nums == 0) {
        msgs.push("Error: password must contain number(s)");
    }

    if (simbols == 0) {
        msgs.push("Error: password must contain symbol(s)");
    }

    return msgs
}


router.post("/register", async(req, res) => {
    const result = userSchema.safeParse(req.body)

    if(!result.success){
        res.status(400).json({ error: result.error })
        return
    }

    const errors = validatePasswd(result.data.passwd)

    if(errors.length > 0){
        res.status(400).json({ error: errors.join("| ")})
        return
    }

    const salt = bcrypt.genSaltSync(14)
    const hash = bcrypt.hashSync(result.data.passwd, salt)

    try {
        const user = await prisma.user.create({
            data: { ...result.data, passwd: hash }
        })
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json(error)
    }

})

router.post("/login", async(req, res) => {
    const result = userSchema.safeParse(req.body)

    if(!result.success){
        res.status(400).json({ error: result.error })
        return
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: result.data.email
            }
        })

        if (user == null) {
            res.status(400).json({ error: "Email/password not found" })
            return
        }

        if (bcrypt.compareSync(result.data.passwd, user.passwd)) {
            const token = jwt.sign(
                { userLogId: user.id, userLogName: user.name },
                process.env.JWT_KEY as string,
                { expiresIn: '1h' }
            )

            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                token
            })
        }
        else {

            await prisma.log.create({
                data: {
                    userId: user.id,
                    descricao: "Tentativa de login com senha inválida",
                    complemento: `Funcionário: ${user.name}`
                }
            })

            res.status(400).json({ error: mensaPadrao })
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.post("/newpass", async(req, res) => {
    const result = newPasswdSchema.safeParse(req.body)
})
