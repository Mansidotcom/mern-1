// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// dotenv = require("dotenv");
// dotenv.config();

// const createorder = async (req, res) => {
//     try {
//         const instance = new Razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID,
//             key_secret: process.env.RAZORPAY_KEY_SECRET,
//         });

//         const options = {
//             amount: req.body.amount * 100, // Amount in paise
//             currency: "INR",
//             receipt: `crypto.randomBytes(10).toString("hex")`, // Generate a random receipt ID
//         };
//         const oder = await instance.orders.create(options);
//         res.status(200).json(oder);
//     } catch (error) {
//         res.status(500).json({ message: "server error" });
//     }
// }