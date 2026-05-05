import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
export const markAttendance = async (req, res) => {
  try {
    const { userId, date, status, method } = req.body;
    const startOfDay = new Date(date || Date.now()).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date || Date.now()).setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existing) {
      existing.status = status || existing.status;
      await existing.save();
      return res.json(existing);
    }

    const attendance = await Attendance.create({
      user: userId,
      date: date || Date.now(),
      status: status || 'Present',
      method: method || 'Manual'
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const getUserAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.params.id }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('user', 'name email role').sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
