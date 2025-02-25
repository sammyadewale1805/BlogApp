import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  content: string;
  post: Types.ObjectId;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default model<IComment>('Comment', commentSchema);