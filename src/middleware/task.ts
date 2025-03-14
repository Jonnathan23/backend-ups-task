import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task.model";

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)

        if (!task) {
            const error = new Error('Tarea no encontrada')
            res.status(404).json({ error: error.message })
            return
        }

        req.task = task
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }

}


export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Proyecto no valido')
        res.status(400).json({ error: error.message })
        return
    }

    next()
}

export function hasAutorization(req: Request, res: Response, next: NextFunction) {
    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error('Acción no valida')
        res.status(400).json({ error: error.message })
        return
    }

    next()
}