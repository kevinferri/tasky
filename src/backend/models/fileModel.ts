import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  createdAt: Date;
  creatorId: mongoose.Types.ObjectId;
  fileName: string;
  fileSize: number;
  format: string;
  resourceType: 'image' | 'video' | 'pdf';
  secureUrl: string;
}

const fileSchema: Schema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    auto: true,
    index: true,
    required: true,
  },
  fileName: { type: String, required: true, index: true },
  fileSize: { type: Number, required: true },
  format: { type: String, required: true },
  resourceType: { type: String, required: true, index: true },
  secureUrl: { type: String, required: true },
});

export default mongoose.model<IFile>('File', fileSchema);
