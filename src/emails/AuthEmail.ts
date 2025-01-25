import { transport } from "../config/nodemailer"
import colors from "colors"
interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        // Enviar email
        const info = await transport.sendMail({
            from: 'Uptask <adming@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta en Uptask',
            text: 'UpTask - Confirma tu cuenta en Uptask',
            html: `<p>Hola ${user.name}, has creado tu cuenta en UpTask, 
            ya casi está todo listo, solo debes confirmar tu cuenta</p>
            
            <p>Visita el sigiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
            <p>Ingre el código: <b>${user.token}</b>
            </p>
            <p>El token expira en 10 minutos</p>
            `
        })

        console.log(colors.green.bold(`Email enviado  ${info.messageId}`))

    }

    static sendPasswordResetToken = async (user: IEmail) => {
        // Enviar email
        const info = await transport.sendMail({
            from: 'Uptask <adming@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta en Uptask',
            text: 'UpTask - Confirma tu cuenta en Uptask',
            html: `<p>Hola ${user.name}, has solicitado, restablecer tu contraseña</p>
            
            <p>Visita el sigiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer mi contraseña</a>
            <p>Ingre el código: <b>${user.token}</b>
            </p>
            <p>El token expira en 10 minutos</p>
            `
        })

        console.log(colors.green.bold(`Email enviado  ${info.messageId}`))

    }
}