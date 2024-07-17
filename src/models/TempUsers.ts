import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITempUser {
  email: string;
  password: string;
  otp: string;
  otpAttempts: number;
  createdAt?: Date;
}

export interface ITempUserDocument extends ITempUser, Document {}

export interface ITempUserModel extends Model<ITempUserDocument> {}

const TempUserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpAttempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: '30m' }
});

const TempUser = mongoose.models.TempUser as ITempUserModel || mongoose.model<ITempUserDocument, ITempUserModel>('TempUser', TempUserSchema);

export default TempUser;