import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  contentType: { type: String, required: true },
  data: mongoose.Schema.Types.Mixed,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
