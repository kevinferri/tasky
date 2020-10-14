import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  createdAt: Date;
  googleId: string;
  googleToken: string;
  name: string;
  email: string;
  picture: 'string';
  refreshToken: string;
}

const userSchema: Schema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  googleId: { type: String, index: true },
  googleToken: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String },
  googleRefreshToken: { type: String },
});

export default model<IUser>('User', userSchema);
