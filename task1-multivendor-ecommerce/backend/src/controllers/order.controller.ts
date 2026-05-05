import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/order.model';


export const addOrderItems = asyncHandler(async (req: any, res: Response) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});


export const getOrderById = asyncHandler(async (req: any, res: Response) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {

        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'vendor') {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


export const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


export const updateOrderToDelivered = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = new Date();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


export const getMyOrders = asyncHandler(async (req: any, res: Response) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});


export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});
