import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  status: 'Planning' | 'Active' | 'Completed';
  visibility: 'public' | 'private';
  progress: number;
  githubUrl?: string;
  demoUrl?: string;
  projectUrl?: string;
  assignedMembers: mongoose.Types.ObjectId[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Planning', 'Active', 'Completed'], default: 'Planning' },
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    githubUrl: { type: String },
    demoUrl: { type: String },
    projectUrl: { type: String },
    assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notes: { type: String },
  },
  { timestamps: true }
);

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
