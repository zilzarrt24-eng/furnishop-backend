import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (requires a token)
router.post('/', protect, asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      user: req.user._id, // Get user from the 'protect' middleware
      orderItems,
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
}));

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private (requires a token)
router.get('/myorders', protect, asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
}));

// This now uses the modern ES Module export syntax.
export default router;

