const Order = require('../model/Order');
const sendEMail = require('../utils/sendEmail');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { products, totalAmount, address, paymentId } = req.body;

        if (!req.user) {
            return res.status(401).json({
                message: 'Please login first to place an order'
            });
        }

        if (!products || products.length === 0 || !totalAmount || !address || !paymentId) {
            return res.status(400).json({
                message: 'Invalid order data'
            });
        }

        const order = new Order({
            user: req.user._id,
            products,
            totalAmount,
            address,
            paymentId
        });

        await order.save();

        const message = `Dear ${req.user.name},

Thank you for your order!

Your order has been successfully created.

Order ID: ${order._id}
Total Amount: ${totalAmount}
Shipping Address: ${address.fullName}, ${address.street}, ${address.city}, ${address.postalCode}, ${address.country}

We will notify you once your order is shipped.

Thank you for shopping with us!

Best regards,
ShopNest Team`;

        await sendEMail(
            req.user.email,
            'Order Confirmation',
            message
        );

        return res.status(201).json({
            message: 'Order created successfully',
            order
        });

    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        return res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product', 'name price');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message || error });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);

    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            await order.save();
            res.json({ message: 'Order status updated successfully', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};


module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
};