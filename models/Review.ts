import { Schema, model, models, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export interface IReview extends Document {
  bookId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema({
  bookId: { type: Number, required: true },
  userId: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

export const Review = models.Review || model<IReview>('Review', reviewSchema); 