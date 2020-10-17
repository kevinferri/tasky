import * as mongoose from 'mongoose';
import { Document, Schema, model } from 'mongoose';

export interface ITodo extends Document {
  createdAt: Date;
  creatorId: mongoose.Types.ObjectId;
  status: 'active' | 'done';
  name: string;
}

const todosSchema: Schema = new Schema({
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
  status: { type: String, index: true, default: 'active' },
  name: { type: String },
});

export default model<ITodo>('Todo', todosSchema);
