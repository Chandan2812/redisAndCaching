const express = require("express");
const { OrderModel } = require("../models/order.model");
const Redis = require("ioredis");
require("dotenv").config()

const statsRouter = express.Router();


const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB_INDEX,
});

// 1. Day Stats
statsRouter.get("/company/:symbol/day-stats", async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const cacheKey = `day-stats-${symbol}`;
        
        // Check if data is cached
        const cachedStats = await redis.get(cacheKey);
        if (cachedStats) {
            const parsedStats = JSON.parse(cachedStats);
            console.log("Cached stats found:", parsedStats);

            // Check if cached data is stale (expired)
            const cacheExpiry = await redis.ttl(cacheKey);
            if (cacheExpiry < 0) {
                console.log("Cached data is stale. Recalculating from MongoDB...");
            } else {
                return res.json(parsedStats);
            }
        }

        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        console.log("Symbol:", symbol);
        console.log("Start of Day:", startOfDay);
        console.log("End of Day:", endOfDay);

        // Calculate day statistics using MongoDB aggregation
        const dayStats = await OrderModel.aggregate([
            { 
                $match: { 
                    company_symbol: symbol, 
                    time: { $gte: startOfDay, $lt: endOfDay } 
                } 
            },
            {
                $group: {
                    _id: null,
                    maxPrice: { $max: "$price" },
                    minPrice: { $min: "$price" },
                    totalCount: { $sum: 1 }
                }
            }
        ]);

        console.log("Day Stats:", dayStats);

        // If no orders for the day, return default values
        if (dayStats.length === 0) {
            const defaultStats = { maxPrice: 0, minPrice: 0, totalCount: 0 };
            console.log("No orders for the day. Returning default stats:", defaultStats);
            return res.json(defaultStats);
        }

        // Cache the day statistics using Redis
        await redis.set(cacheKey, JSON.stringify(dayStats[0]), "EX", 86400); // 1 day expiry

        console.log("Day stats cached:", dayStats[0]);

        res.json(dayStats[0]);
    } catch (error) {
        console.error("Error calculating day stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});






// 2. Month Stats
statsRouter.get("/company/:symbol/month-stats", async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const cacheKey = `month-stats-${symbol}`;

        // Check if data is cached
        const cachedStats = await redis.get(cacheKey);
        if (cachedStats) {
            return res.json(JSON.parse(cachedStats));
        }

        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        // Calculate month statistics using MongoDB aggregation
        const monthStats = await OrderModel.aggregate([
            { $match: { company_symbol: symbol, time: { $gte: startOfMonth, $lt: endOfMonth } } },
            {
                $group: {
                    _id: null,
                    maxPrice: { $max: "$price" },
                    minPrice: { $min: "$price" },
                    totalCount: { $sum: 1 }
                }
            }
        ]);

        // If no orders for the month, return default values
        const { maxPrice = 0, minPrice = 0, totalCount = 0 } = (monthStats[0] || {});

        // Cache the month statistics using Redis
        await redis.set(cacheKey, JSON.stringify({ maxPrice, minPrice, totalCount }), "EX", 86400); // 1 day expiry

        res.json({ maxPrice, minPrice, totalCount });
    } catch (error) {
        console.error("Error calculating month stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = {statsRouter};
