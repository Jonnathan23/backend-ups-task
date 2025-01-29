import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import projectRoutes from './routes/project.routes'
import authRoutes from './routes/auth.routes'
import { corsConfig } from './config/cors'

dotenv.config()

connectDB()

const app = express()
app.use(cors(corsConfig))

app.use(morgan('dev'))
app.use(express.json())

app.use('/api/projects', projectRoutes)
app.use('/api/auth', authRoutes)

export default app