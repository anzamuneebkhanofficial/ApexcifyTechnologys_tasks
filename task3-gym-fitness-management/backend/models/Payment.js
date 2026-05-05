import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'PKR'
  },
  paymentMethod: {
    type: String,
    enum: ['Stripe', 'Manual', 'Easypaisa', 'BankTransfer'],
    default: 'Manual'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Rejected'],
    default: 'Pending'
  },
  transactionId: {
    type: String,
  },
  screenshotUrl: {
    type: String,
  },
  subscriptionMonths: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
