const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET /api/menu - Fetch all with search
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    const menuItems = await MenuItem.find(query);
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/menu - Create new item
router.post('/', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/menu/:id/availability - Optimistic UI target
router.patch('/:id/availability', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.isAvailable = !item.isAvailable;
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/menu/:id
router.delete('/:id', async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;