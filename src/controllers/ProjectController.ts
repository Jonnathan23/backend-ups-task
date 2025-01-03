import type { Request, Response } from "express"
import Project from "../models/Project.model"

export class ProjectController {

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({}, '-createdAt -updatedAt')
            res.send(projects)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        try {
            res.send(req.project)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }

    }

    static createProject = async (req: Request, res: Response) => {

        const project = new Project(req.body)

        try {
            await project.save()
            res.send('Proyecto creado correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateProject = async (req: Request, res: Response) => {        
        try {  
            req.project.clientName = req.body.clientName
            await req.project.save()
            res.send('Proyecto actualizado correctamente')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {            
            await req.project.deleteOne()
            res.send('Proyecto eliminado correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}