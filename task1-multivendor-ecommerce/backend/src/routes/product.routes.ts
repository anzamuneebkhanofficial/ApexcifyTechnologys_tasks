import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, createProductReview } from '../controllers/product.controller';
import { protect, vendor } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, vendor, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, vendor, updateProduct);

router.route('/:id/reviews').post(protect, createProductReview);

export default router;
