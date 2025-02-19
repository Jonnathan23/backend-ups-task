import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";


export const connectDB = async () => {
    try {
        const baseUrl = process.argv[3] === '--local' ? process.env.DATABASE_URL_LOCAL:process.env.DATABASE_URL
        const { connection } = await mongoose.connect(baseUrl)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.blue.bold(`MongoDB connected in ${url}`))
    } catch (error) {
        console.log(colors.red.bold(error.message))
        console.log(colors.red.bold('Error al conectar a MongoDB'))
        exit(1)
    }
}
