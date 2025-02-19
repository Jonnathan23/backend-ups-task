import { Request, Response } from "express"
import User from "../models/User.model"

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            //Find user by email
            const user = await User.findOne({ email }).select('id email name')
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' })
                return
            }
            res.send(user)
        } catch (error) {
            res.status(500).json({ errors: error })
        }
    }

    static addMemberById = async (req: Request, res: Response) => {
        try {
            const { id } = req.body
            const user = await User.findById(id).select('id')
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' })
                return
            }

            if(req.project.team.some(team => team.toString() === user.id.toString())) {
                res.status(409).json({ error: 'El usuario ya pertenece al equipo' })
                return
            }

            req.project.team.push(user.id)
            await req.project.save()

            res.send('Usuario añadido al equipo con exito')
        } catch (error) {
            res.status(500).json({ errors: error })
        }
    }
}