import Payment from '../models/Payment.js';
import User from '../models/User.js';
import stripePackage from 'stripe';
import { sendEmail } from '../config/nodemailer.js';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, subscriptionMonths } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'pkr',
      metadata: {
        userId: req.user._id.toString(),
        subscriptionMonths: subscriptionMonths.toString()
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const manualPayment = async (req, res) => {
  try {
    const { amount, subscriptionMonths, transactionId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Screenshot is required for manual payment' });
    }

    const payment = await Payment.create({
      user: req.user._id,
      amount,
      subscriptionMonths,
      paymentMethod: 'Manual',
      status: 'Pending',
      transactionId,
      screenshotUrl: `/uploads/${req.file.filename}`
    });
    await sendEmail(
      process.env.SMTP_USER,
      'New Manual Payment Verification Required',
      `User ${req.user.name} (${req.user.email}) has uploaded a payment screenshot for verification. Amount: PKR ${amount}`
    );

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const verifyPayment = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id).populate('user');

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    payment.status = status;
    await payment.save();

    if (status === 'Completed') {
      const user = await User.findById(payment.user._id);
      user.subscriptionStatus = 'active';
      const currentDate = user.subscriptionEnd && user.subscriptionEnd > new Date()
        ? user.subscriptionEnd
        : new Date();

      currentDate.setMonth(currentDate.getMonth() + payment.subscriptionMonths);
      user.subscriptionEnd = currentDate;

      await user.save();
      await sendEmail(
        user.email,
        'Payment Verified - Pak Gym Subscription Active',
        `Hello ${user.name},\n\nYour payment of PKR ${payment.amount} has been verified. Your subscription is now active until ${user.subscriptionEnd.toLocaleDateString()}.`
      );
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment record removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
