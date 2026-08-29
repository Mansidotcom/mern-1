const Order = require("../model/Order");
const User = require("../model/User");
const Product = require("../model/Product");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    const orders = await Order.find({});

    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    res.json({ totalUsers, totalOrders, totalProducts, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats" });
  }
}; 

module.exports = { getAdminStats };

