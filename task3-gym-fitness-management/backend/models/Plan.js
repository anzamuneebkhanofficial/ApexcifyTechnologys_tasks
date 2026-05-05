import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Workout', 'Diet'],
    required: true
  },
  description: {
    type: String
  },
  fileUrl: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
