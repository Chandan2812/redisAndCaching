const express = require("express");
const { mongoConnection } = require("./config/db");
const {companyRouter} = require("./routes/company.route");
const {orderRouter} = require("./routes/order.route");
const {statsRouter} = require("./routes/stats.route");
const logger = require('./logger');
const fs = require("fs");
const path = require("path");

require("dotenv").config();
const PORT = process.env.PORT || 8000;

const app = express();



const logDirectory = path.join(__dirname, 'logs');
// Create logs directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Middleware to log requests
app.use((req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`;
    fs.appendFile(path.join(logDirectory, 'requests.log'), logEntry + '\n', (err) => {
        if (err) {
            console.error("Error writing to log file:", err);
        }
    });
    next();
});


// Middleware
app.use(express.json());

// Routes
app.get('/',async(req,res)=>{
    res.send('hello');
})
app.use("/company", companyRouter);
app.use("/order", orderRouter);
app.use("/stats",statsRouter);


// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`An error occurred: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(PORT, async () => {
    try {
        await mongoConnection;
        logger.info("Connected to MongoDB");
        logger.info("Connected to Redis");
        logger.info(`Server is running @ ${PORT}`);
    } catch (error) {
        logger.error("Failed to connect to Database");
    }
});
