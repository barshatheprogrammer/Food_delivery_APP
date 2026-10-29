const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
