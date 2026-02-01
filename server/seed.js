require('dotenv').config();
const connectDB = require('./config/db');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Database Connected...');

    // Clear existing data
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Old data cleared...');

    // Create Menu Items
    const menuItems = await MenuItem.insertMany([
      { name: 'Spicy Tacos', category: 'Main Course', price: 12.50, isAvailable: true, ingredients: 'Beef, Tortilla, Chili' },
      { name: 'Caesar Salad', category: 'Appetizer', price: 8.00, isAvailable: true, ingredients: 'Lettuce, Croutons, Dressing' },
      { name: 'Cheese Burger', category: 'Main Course', price: 15.00, isAvailable: true, ingredients: 'Beef patty, Cheese, Bun' },
      { name: 'Ice Cream', category: 'Dessert', price: 5.50, isAvailable: false, ingredients: 'Vanilla, Chocolate Chips' },
      { name: 'Lemonade', category: 'Beverage', price: 3.50, isAvailable: true, ingredients: 'Lemon, Water, Sugar' }
    ]);

    console.log(`${menuItems.length} Menu Items created.`);

    // Create Orders
    const tacosId = menuItems[0]._id; 
    const burgerId = menuItems[2]._id; 
    const saladId = menuItems[1]._id; 

    await Order.insertMany([
      { 
        customerName: 'John Doe', 
        status: 'Paid', 
        items: [{ menuItem: tacosId, quantity: 2, price: 12.50 }], 
        totalAmount: 25.00 
      },
      { 
        customerName: 'Sarah Smith', 
        status: 'Pending', 
        items: [{ menuItem: burgerId, quantity: 1, price: 15.00 }], 
        totalAmount: 15.00 
      },
      { 
        customerName: 'Mike Ross', 
        status: 'Paid', 
        items: [{ menuItem: tacosId, quantity: 3, price: 12.50 }, { menuItem: saladId, quantity: 1, price: 8.00 }], 
        totalAmount: 45.50 
      }
    ]);

    console.log('Orders created.');
    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();