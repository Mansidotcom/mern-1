const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

const seedDB = async () => {
  try {
    const connected = await connectDB();
    if (!connected) {
      console.log("MongoDB not connected. Seed process stopped.");
      process.exit(1);
    }

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        verified: true,
      },
      {
        name: "Mansi Patel",
        email: "mansi@example.com",
        password: hashedPassword,
        role: "user",
        verified: true,
      },
      {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        password: hashedPassword,
        role: "user",
        verified: false,
      },
    ]);

    const products = await Product.insertMany([
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones with immersive sound.",
        price: 2499,
        imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
        stock: 25,
        rating: 4.5,
        numReviews: 18,
      },
      {
        name: "Smart Watch",
        description: "Fitness tracker with heart rate sensor and AMOLED display.",
        price: 3999,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        stock: 15,
        rating: 4.7,
        numReviews: 26,
      },
      {
        name: "Laptop Stand",
        description: "Aluminum laptop stand for ergonomic desk setup.",
        price: 1499,
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
        stock: 30,
        rating: 4.2,
        numReviews: 10,
      },
      {
        name: "Coffee Maker",
        description: "Compact coffee machine for quick morning brews.",
        price: 3299,
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        stock: 12,
        rating: 4.6,
        numReviews: 14,
      },
    ]);

    const orders = await Order.insertMany([
      {
        user: users[1]._id,
        products: [
          { product: products[0]._id, quantity: 1 },
          { product: products[2]._id, quantity: 2 },
        ],
        totalAmount: 2499 + 1499 * 2,
        address: {
          fullName: "Mansi Patel",
          street: "12 River View Road",
          city: "Ahmedabad",
          postalCode: "380001",
          country: "India",
        },
        paymentId: "pay_demo_101",
        status: "Paid",
      },
      {
        user: users[2]._id,
        products: [
          { product: products[1]._id, quantity: 1 },
          { product: products[3]._id, quantity: 1 },
        ],
        totalAmount: 3999 + 3299,
        address: {
          fullName: "Rahul Sharma",
          street: "55 Market Street",
          city: "Delhi",
          postalCode: "110001",
          country: "India",
        },
        paymentId: "pay_demo_102",
        status: "Pending",
      },
    ]);

    console.log("Database seeded successfully");
    console.log(`Created ${users.length} users, ${products.length} products, ${orders.length} orders.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
