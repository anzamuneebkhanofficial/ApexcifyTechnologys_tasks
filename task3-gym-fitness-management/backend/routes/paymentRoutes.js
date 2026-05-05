import express from 'express';
import { 
  createPaymentIntent, 
  manualPayment, 
  verifyPayment, 
  getMyPayments, 
  getAllPayments,
  deletePayment
} from '../controllers/paymentController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/create-intent', verifyToken, createPaymentIntent);
router.post('/manual', verifyToken, upload.single('screenshot'), manualPayment);
router.put('/:id/verify', verifyToken, authorizeRoles('Admin'), verifyPayment);
router.get('/my', verifyToken, getMyPayments);
router.get('/', verifyToken, authorizeRoles('Admin'), getAllPayments);
router.delete('/:id', verifyToken, authorizeRoles('Admin'), deletePayment);

export default router;
