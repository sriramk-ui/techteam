import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVault extends Document {
  project_id: mongoose.Types.ObjectId;
  encryptedData: string;
  createdAt: Date;
  updatedAt: Date;
}

const VaultSchema: Schema = new Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
    encryptedData: { type: String, required: true },
  },
  { timestamps: true }
);

export const Vault: Model<IVault> = mongoose.models.Vault || mongoose.model<IVault>('Vault', VaultSchema);
