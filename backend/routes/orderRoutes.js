const express = require('express');

const { protect } = require('../middlewere/authMidleware');
const { admin } = require('../middlewere/adminMidleware');
const { createOrder, getOrders, myOrders, updateOrderStatus } = require('../controller/orderController');

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/myorders').get(protect, myOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
