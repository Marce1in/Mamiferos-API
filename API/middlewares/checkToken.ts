import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken"

interface Token {
    userLoggedId: number
    userLoggedName: string
}

export function verifyToken(req: Request | any, res: Response, next: NextFunction) {
    const { authorization } = req.headers

    if (!authorization) {
        res.status(401).json({ error: "Token not founded" })
        return
    }

    const token = authorization.split(" ")[1]

    try {
        const decode = jwt.verify(token, process.env.JWT_KEY as string)
        const { userLoggedId: userLoggedId, userLoggedName: userLoggedName } = decode as Token

        req.userLogadoId   = userLoggedId
        req.userLogadoNome = userLoggedName

        next()
    } catch (error) {
        res.status(401).json({ error: "Token Invalid" })
    }
}
