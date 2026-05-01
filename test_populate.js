import mongoose from 'mongoose';
import { Vault } from './src/models/Vault.js';

async function test() {
  try {
    const doc = new Vault({ project_id: new mongoose.Types.ObjectId(), encryptedData: 'test' });
    await doc.populate('project_id');
  } catch (e) {
    console.error(e.message);
  }
}
test();
