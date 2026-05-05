import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduleTime: {
    type: Date,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true,
    default: 60
  },
  capacity: {
    type: Number,
    required: true,
    default: 20
  },
  enrolledMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);
export default Class;
