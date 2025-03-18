import { Request, Response } from "express";
import Note, { INote } from "../models/Note.model";
import { Types } from "mongoose";

type NoteParams = { noteId: Types.ObjectId }

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        try {
            const { content } = req.body

            const note = new Note()
            note.content = content
            note.createdBy = req.user.id
            note.task = req.task.id

            req.task.notes.push(note.id)
            await Promise.all([note.save(), req.task.save()])
            res.status(201).send("Nota creada correctamente")
        } catch (error) {
            res.status(500).json({ errors: 'Hubo un error' })
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task.id })
            res.json(notes)
        } catch (error) {
            res.status(500).json({ errors: 'Hubo un error' })
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        try {
            const { noteId } = req.params
            const note = await Note.findById(noteId)
            if (!note) {
                res.status(404).json({ errors: 'La nota no existe' })
                return
            }

            if (note.createdBy.toString() !== req.user.id.toString()) {
                res.status(401).json({ errors: 'Acción no válida' })
                return
            }
            req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())
            await Promise.all([req.task.save(), note.deleteOne()])
            
            res.send('Nota eliminada correctamente')
        } catch (error) {
            res.status(500).json({ errors: error })
        }
    }
}