const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/orders - Fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.menuItem', 'name price') 
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH /api/orders/:id/status - Update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/analytics/top-sellers - Aggregation
router.get('/analytics/top-sellers', async (req, res) => {
  try {
    const topSellers = await Order.aggregate([
      { $unwind: "$items" },
      { $group: {
          _id: "$items.menuItem",
          totalQty: { $sum: "$items.quantity" }
      }},
      { $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "details"
      }},
      { $unwind: "$details" },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      { $project: {
          name: "$details.name",
          totalSold: "$totalQty",
          category: "$details.category"
      }}
    ]);
    res.json(topSellers);
  } catch (err) {
    console.error("Aggregation Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;