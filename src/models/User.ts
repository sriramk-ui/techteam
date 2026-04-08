import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  instagram?: string;
  gmail?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  profilePic?: string;
  role: 'ADMIN' | 'MEMBER';
  socialLinks: ISocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Don't return password by default
    profilePic: { type: String, default: '' },
    role: { type: String, enum: ['ADMIN', 'MEMBER'], default: 'MEMBER' },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      gmail: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
