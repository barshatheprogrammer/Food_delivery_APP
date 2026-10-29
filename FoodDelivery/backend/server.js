const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ==========================================
// Auth Routes
// ==========================================

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email is already registered' });
        }

        const newUser = new User({ name, email, phone, password });
        await newUser.save();
        
        res.status(201).json({ success: true, message: 'User created successfully', user: { name: newUser.name, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Account not found. Please sign up.' });
        }

        if (user.password !== password) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }
        
        res.status(200).json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// ==========================================
// Order Routes
// ==========================================

// Create an Order
app.post('/api/orders', async (req, res) => {
    try {
        const { email, items, total, date } = req.body;
        
        const newOrder = new Order({ email, items, total, date });
        await newOrder.save();
        
        res.status(201).json({ success: true, message: 'Order placed successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Get Past Orders
app.get('/api/orders/:email', async (req, res) => {
    try {
        const orders = await Order.find({ email: req.params.email }).sort({ _id: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
