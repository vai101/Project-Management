import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    name: string;
    description: string;
    createdAt: Date;
}

const ProjectSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
});

ProjectSchema.index({ name: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);