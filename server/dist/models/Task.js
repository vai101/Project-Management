import mongoose, { Document, Schema, Types } from 'mongoose';
const TaskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do',
        required: true
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ deletedAt: 1 });
export default mongoose.model('Task', TaskSchema);
//# sourceMappingURL=Task.js.map