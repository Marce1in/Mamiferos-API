import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken"

export interface Token {
    userLoggedId: number
    userLoggedName: string
}

export function checkToken(req: Request | any, res: Response, next: NextFunction) {
    const { authorization } = req.headers

    if (!authorization) {
        res.status(401).json({ error: "Token not founded" })
        return
    }

    const token = authorization.split(" ")[1]

    try {
        const decode = jwt.verify(token, process.env.JWT_KEY as string)
        const { userLoggedId: userLoggedId, userLoggedName: userLoggedName } = decode as Token

        req.userLoggedId   = userLoggedId
        req.userLoggedName = userLoggedName

        next()
    } catch (error) {
        res.status(401).json({ error: "Token Invalid" })
    }
}
