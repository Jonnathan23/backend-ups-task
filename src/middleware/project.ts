import { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project.model";

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function projectExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params
        const project = await Project.findById(projectId).populate('tasks')

        if (!project) {
            const error = new Error('Proyecto no encontrado')
            res.status(404).json({ msg: error.message })
            return
        }

        req.project = project
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }

}