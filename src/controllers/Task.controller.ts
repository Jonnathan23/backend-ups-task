import type { Request, Response } from "express";

import Task from "../models/Task.model";
import { stripColors } from "colors";

export class TaskController {
    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate({ path: 'project' });

            res.json(tasks)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task.id)
                .populate({ path: 'completedBy', select: '_id name' })
                .populate({ path: 'notes', populate: { path: 'createdBy', select: '_id name' } })
            res.status(200).json(task)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error })
        }
    }

    static createTask = async (req: Request, res: Response) => {

        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task)

            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {

            req.task.name = req.body.name
            req.task.description = req.body.description

            await req.task.save()
            res.send('Tarea actualizada correctamente')

        } catch (error) {
            console.log(stripColors.bgRed(error))
            res.status(500).json({ error: error })
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())

            await Promise.allSettled([req.task.deleteOne(), req.project.save()])

            res.send('Tarea eliminada correctamente')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateTaskStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            req.task.status = status
            req.task.completedBy = status === 'pending' ? null : req.user.id
            await req.task.save()
            res.send('Tarea actualizada correctamente')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}