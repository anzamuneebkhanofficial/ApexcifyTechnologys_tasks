import express from 'express';
import { getTenders, createTender, updateTender, deleteTender } from '../controllers/tenderController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getTenders);
router.post('/', verifyToken, authorizeRoles('Admin'), createTender);
router.put('/:id', verifyToken, authorizeRoles('Admin'), updateTender);
router.delete('/:id', verifyToken, authorizeRoles('Admin'), deleteTender);

export default router;
