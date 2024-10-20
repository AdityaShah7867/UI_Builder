import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  cssUuid: { type: String, required: true },
  contentType: {
    type: String,
    required: true,
    // enum: ['type1', 'type2', 'type3'], // Uncomment and add your types
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Automatically update updatedAt before saving
ContentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
