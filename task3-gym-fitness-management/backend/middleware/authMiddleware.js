import admin from '../config/firebase.js';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const displayName =
      decoded.name ||
      decoded.displayName ||
      (decoded.email ? decoded.email.split('@')[0] : null) ||
      'New User';
    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: displayName,
        email: decoded.email || '',
        profileImage: decoded.picture || '',
        role: 'Member',
      });
    } else if (user.name === 'Unknown User' || !user.name) {
      user.name = displayName;
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.code || error.message);
    return res.status(401).json({ message: 'Not authorized — token invalid or expired' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role "${req.user?.role || 'None'}" is not authorized to access this resource`,
      });
    }
    next();
  };
};
