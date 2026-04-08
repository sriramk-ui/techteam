import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  type: string; // 'Hackathon', 'Workshop', 'Competition etc'
  date: Date;
  result?: string;
  visibility: 'public' | 'private';
  images: string[];
  assignedMembers: mongoose.Types.ObjectId[];
  strategyNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    result: { type: String },
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
    images: [{ type: String }],
    assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    strategyNotes: { type: String },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
