import type { Request, Response } from "express"
import Project from "../models/Project.model"

export class ProjectController {

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: { $in: req.user.id } },
                ]
            }, '-createdAt -updatedAt')
            res.send(projects)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        try {
            const project = req.project
            if (project.manager.toString() !== req.user.id.toString()) {
                res.status(404).json({ error: 'Acción no válida' })
                return
            }

            res.send(project)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }

    }

    static createProject = async (req: Request, res: Response) => {        
        try {
            const project = new Project(req.body)
            project.manager = req.user.id

            await project.save()
            res.send('Proyecto creado correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            const project = req.project
            if (project.manager.toString() !== req.user.id.toString()) {
                res.status(404).json({ error: 'Solo el manager puede actualizar el proyecto' })
                return
            }


            project.clientName = req.body.clientName
            project.projectName = req.body.projectName
            project.description = req.body.description

            await project.save()
            res.send('Proyecto actualizado correctamente')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            const project = req.project
            if (project.manager.toString() !== req.user.id.toString()) {
                res.status(404).json({ error: 'Solo el manager puede eliminar el proyecto' })
                return
            }

            //TODO: Borrar tareas
            await project.deleteOne()
            res.send('Proyecto eliminado correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}