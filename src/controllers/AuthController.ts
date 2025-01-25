import { Request, Response } from "express";
import User from "../models/Auth";
import { checkPassword, hashPassword } from "../utils/auth";
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
                res.status(404).json({ error: 'Token no encontrado' })
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

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })

            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' })
                return
            }

            if (!user.confirmed) {
                const token = new Token({ token: generateToken(), user: user._id });
                await token.save();

                AuthEmail.sendConfirmationEmail({ email: user.email, name: user.name, token: token.token })

                const error = new Error('La Cuenta no está confirmada, hemos enviado un correo para confirmarla')

                res.status(401).json({ error: error.message })
                return
            }

            // Revisar Password
            const correctPassword = await checkPassword(password, user.password)

            if (!correctPassword) {
                res.status(401).json({ error: 'Contraseña incorrecta' })
                return
            }

            res.send('Usuario logueado correctamente')

        } catch (error) {
            console.log('\n')
            console.log(colors.red(error))
            res.status(500).json({ error: error })
        }
    }


    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body                        
            const userExists = await User.findOne({ email })
            
            if (!userExists) {
                res.status(404).json({ error: 'El usuario no está registrado' })
                return
            }

            if (userExists.confirmed) {
                res.status(403).json({ error: 'El usuario ya está confirmado' })
                return
            }

            //Generar token            
            const token = new Token({ token: generateToken(), user: userExists._id });
            await token.save()
            AuthEmail.sendConfirmationEmail({ email: userExists.email, name: userExists.name, token: token.token })

            res.send('Se envió un nuevo token a tu e-mail')
        } catch (error) {
            console.log('\n')
            console.log(colors.red(error))
            res.status(500).json({ error: error })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body                       
            const userExists = await User.findOne({ email })            

            if (!userExists) {
                res.status(404).json({ error: 'El usuario no está registrado' })
                return
            }

            if (!userExists.confirmed) {
                res.status(403).json({ error: 'El usuario no está confirmado' })
                return
            }

            //Generar token            
            const token = new Token({ token: generateToken(), user: userExists._id });
            await token.save()
            AuthEmail.sendPasswordResetToken({ email: userExists.email, name: userExists.name, token: token.token })

            res.send('Revisa tu e-mail para la recuperación de tu contraseña')
        } catch (error) {
            console.log('\n')
            console.log(colors.red(error))
            res.status(500).json({ error: error })
        }
    }
}