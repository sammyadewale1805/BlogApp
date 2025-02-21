import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'; // Import bcrypt

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'author', 'reader'], default: 'reader' },
});

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); // Use bcrypt
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password); // Use bcrypt
};

export default model<IUser>('User', userSchema);