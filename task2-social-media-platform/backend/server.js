const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
