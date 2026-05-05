import User from '../models/User.js';
import admin from '../config/firebase.js';
export const registerUser = async (req, res) => {
  const { role, name } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    if (role && ['Admin', 'Trainer', 'Member'].includes(role)) {
      user.role = role;
    }
    if (name) {
      user.name = name;
    }
    await user.save();
    req.user = user;
  }

  res.status(200).json(req.user);
};
export const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
