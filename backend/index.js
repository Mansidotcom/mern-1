const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
const app = express();

app.use(cors(
    {
        origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002', process.env.FRONTEND_URL],
       credentials: true
    }
));  


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/products', require('./routes/productRoutes'));
 app.use('/api/orders', require('./routes/orderRoutes'));
 //app.use('/api/payments', require('./routes/paymentRoutes'));
 app.use('/api/analytics', require('./routes/analyticsRoutes'));


if (process.env.NODE_ENV === 'production' || process.env.MODE_ENV === 'production') {
    // Frontend is deployed separately as a Render Static Site
}
else {
    app.get('/', (req, res) => {
        res.send('ShopNest API is running in Devlopment mode....')
    })
}


const PORT = process.env.PORT || 5000; 

const startServer = async () => {
    const connected = await connectDB(); 

    if (!connected) {
        console.log("MongoDB not connected. Server not started.");
        return;
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();