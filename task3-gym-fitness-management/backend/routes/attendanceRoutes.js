import express from 'express';
import { markAttendance, getUserAttendance, getAllAttendance } from '../controllers/attendanceController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, authorizeRoles('Admin', 'Trainer'), markAttendance);
router.get('/user/:id', verifyToken, getUserAttendance);
router.get('/', verifyToken, authorizeRoles('Admin', 'Trainer'), getAllAttendance);

export default router;
