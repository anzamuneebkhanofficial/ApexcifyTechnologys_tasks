import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/product.model';


export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find({}).populate('vendor', 'name email');
    res.json(products);
});


export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate('vendor', 'name email');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});


export const createProduct = asyncHandler(async (req: any, res: Response) => {
    const product = new Product({
        name: 'Premium Headphones',
        price: 199.99,
        vendor: req.user._id,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        brand: 'Sony',
        category: 'Electronics',
        countInStock: 10,
        numReviews: 0,
        description: 'High quality premium headphones.',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});


export const updateProduct = asyncHandler(async (req: any, res: Response) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized to update this product');
        }

        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export const createProductReview = asyncHandler(async (req: any, res: Response) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r: any) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc: any, item: any) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});
