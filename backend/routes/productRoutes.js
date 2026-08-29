const express = require('express');
const { protect } = require("../middlewere/authMidleware");
const { admin } = require("../middlewere/adminMidleware");
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controller/productController');
const upload = require('../config/multer');

//const upload = multer({ dest: 'uploads/' });


const router = express.Router();

//all products
router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);

//specific product
router.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
