import mongoose, { Schema, Document } from "mongoose";

// Type Project
export type ProjectType = Document & {
    projectName: string
    clienteName: string
    description: string
}

// Schema MongoDb
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clienteName: {
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

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project