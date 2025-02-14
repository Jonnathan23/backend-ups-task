import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User, { IUser } from "../models/User.model";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        res.status(401).json({ error: 'No autorizado' })
        return
    }

    const [, token] = bearer.split(' ')

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id email name')
            if (user) {
                req.user = user
                //next()
            } else {
                res.status(500).json({ error: 'Token no valido' })
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Token no valido' })
    }

    next()
}