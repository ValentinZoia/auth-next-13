import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITempUser {
  email: string;
  password: string;
  otp: string;
  otpAttempts: number;
  expireAt: Date;
  createdAt?: Date;
}

export interface ITempUserDocument extends ITempUser, Document {}

export interface ITempUserModel extends Model<ITempUserDocument> {}

const TempUserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpAttempts: { type: Number, default: 0 },
  expireAt: { type: Date, required: true},
  createdAt: { type: Date, default: Date.now,}
},{
  versionKey: false,
  timestamps: true,
});

TempUserSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const TempUser = mongoose.models.TempUser as ITempUserModel || mongoose.model<ITempUserDocument, ITempUserModel>('TempUser', TempUserSchema);

export default TempUser;