import mongoose, { Document, Schema } from 'mongoose';
const ProjectSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
});
ProjectSchema.index({ name: 1 });
export default mongoose.model('Project', ProjectSchema);
//# sourceMappingURL=Project.js.map