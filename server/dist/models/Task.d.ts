import mongoose, { Document, Types } from 'mongoose';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export interface ITask extends Document {
    title: string;
    description: string;
    status: TaskStatus;
    project: Types.ObjectId;
    createdAt: Date;
    deletedAt?: Date | null;
}
declare const _default: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Task.d.ts.map