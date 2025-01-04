import { Request, Response } from "express";
import User from "../models/Auth";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import colors from "colors";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            const user = new User(req.body)

            // Prevenir duplicados
            const userExists = await User.findOne({ email })

            if (userExists) {
                res.status(409).json({ error: 'El email ya esta en uso' })
                return
            }
            //Encriptar contraseña
            user.password = await hashPassword(password)

            //Generar token            
            const token = new Token({ token: generateToken(), user: user._id });
            AuthEmail.sendConfirmationEmail({ email: user.email, name: user.name, token: token.token })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada, revisa tu email para confirmar tu cuenta')
        } catch (error) {
            console.log('\n')
            console.log(colors.red(error))
            res.status(500).json({ error: error })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })

            if (!tokenExists) {
                res.status(401).json({ error: 'Token no encontrado' })
                return
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            console.log('\n')
            console.log(colors.red(error))
            res.status(500).json({ error: error })
        }
    }
}