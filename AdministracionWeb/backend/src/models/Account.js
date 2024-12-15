import mongoose from 'mongoose';

const cookieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  domain: String,
  path: { type: String, default: '/' },
  secure: { type: Boolean, default: true },
  httpOnly: { type: Boolean, default: true },
  expirationDate: Number
});

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true },
  cookies: [cookieSchema],
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

accountSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Account', accountSchema);