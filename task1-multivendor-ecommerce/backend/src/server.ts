import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: 'API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
