import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export const vendor = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === 'vendor' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as a vendor');
    }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};
