import mongoose, { Schema, Document } from "mongoose";

// Type Project
export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
}

// Schema MongoDb
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
})

const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project