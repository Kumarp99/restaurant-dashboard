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
    
    // 1. Clear old data to avoid duplicates
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared old data...');

    // 2. Create 15+ Menu Items
    const menuItems = await MenuItem.insertMany([
      { name: 'Spicy Tacos', category: 'Main Course', price: 12.50, isAvailable: true, ingredients: 'Beef, Tortilla' },
      { name: 'Garlic Bread', category: 'Appetizer', price: 6.00, isAvailable: true, ingredients: 'Garlic, Bread, Cheese' },
      { name: 'Caesar Salad', category: 'Appetizer', price: 8.00, isAvailable: true, ingredients: 'Lettuce, Croutons' },
      { name: 'French Fries', category: 'Appetizer', price: 5.50, isAvailable: true, ingredients: 'Potato, Salt' },
      { name: 'Tomato Soup', category: 'Appetizer', price: 6.50, isAvailable: true, ingredients: 'Tomato, Herbs' },
      { name: 'Cheese Burger', category: 'Main Course', price: 15.00, isAvailable: true, ingredients: 'Beef, Cheese, Bun' },
      { name: 'Pepperoni Pizza', category: 'Main Course', price: 18.00, isAvailable: true, ingredients: 'Pizza dough, Cheese, Pepperoni' },
      { name: 'Butter Chicken', category: 'Main Course', price: 22.00, isAvailable: true, ingredients: 'Chicken, Tomato Gravy' },
      { name: 'Veg Biryani', category: 'Main Course', price: 14.50, isAvailable: true, ingredients: 'Rice, Vegetables' },
      { name: 'Grilled Steak', category: 'Main Course', price: 35.00, isAvailable: true, ingredients: 'Beef, Sauce' },
      { name: 'Pasta Alfredo', category: 'Main Course', price: 16.50, isAvailable: true, ingredients: 'Pasta, Cream, Chicken' },
      { name: 'Veg Noodles', category: 'Main Course', price: 12.00, isAvailable: true, ingredients: 'Noodles, Soy Sauce' },
      { name: 'Chicken Curry', category: 'Main Course', price: 18.50, isAvailable: true, ingredients: 'Chicken, Spices' },
      { name: 'Fish and Chips', category: 'Main Course', price: 20.00, isAvailable: true, ingredients: 'Fish, Fries' },
      { name: 'Chocolate Shake', category: 'Beverage', price: 7.00, isAvailable: true, ingredients: 'Chocolate, Milk' },
      { name: 'Iced Tea', category: 'Beverage', price: 4.50, isAvailable: true, ingredients: 'Tea, Ice' }
    ]);
    
    // 3. Create Orders (linking to the new items)
    await Order.insertMany([
      { customerName: 'Cloud User 1', status: 'Paid', items: [{ menuItem: menuItems[0]._id, quantity: 2, price: 12.50 }], totalAmount: 25.00 },
      { customerName: 'Cloud User 2', status: 'Paid', items: [{ menuItem: menuItems[0]._id, quantity: 5, price: 12.50 }], totalAmount: 62.50 },
      { customerName: 'Cloud User 3', status: 'Paid', items: [{ menuItem: menuItems[6]._id, quantity: 3, price: 18.00 }], totalAmount: 54.00 }
    ]);

    res.send(`Database seeded with ${menuItems.length} items!`);
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});
// ---------------------------


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
