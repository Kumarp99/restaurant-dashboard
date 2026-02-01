require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Connect Database
connectDB();

// Routes (We will create these files in the next step)
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;

// --- TEMPORARY SEED ROUTE ---
app.get('/seed-db', async (req, res) => {
  try {
    const MenuItem = require('./models/MenuItem');
    const Order = require('./models/Order');
    
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared old data...');

    const menuItems = await MenuItem.insertMany([
      { name: 'Spicy Tacos', category: 'Main Course', price: 12.50, isAvailable: true, ingredients: 'Beef, Tortilla' },
      { name: 'Caesar Salad', category: 'Appetizer', price: 8.00, isAvailable: true, ingredients: 'Lettuce' },
      { name: 'Burger', category: 'Main Course', price: 15.00, isAvailable: true, ingredients: 'Meat' }
    ]);
    
    await Order.insertMany([
      { customerName: 'Cloud User', status: 'Paid', items: [{ menuItem: menuItems[0]._id, quantity: 2, price: 12.50 }], totalAmount: 25.00 }
    ]);

    res.send("Database Seeded! Go back to /api/menu to check.");
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});
// ---------------------------



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));