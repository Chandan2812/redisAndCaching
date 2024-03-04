const express = require("express");
const { OrderModel } = require("../models/order.model");

const orderRouter = express.Router();

// 1. Create a New Order
orderRouter.post("/", async (req, res) => {
    try {
        const { company_symbol, price } = req.body;
        // Create a new order
        const newOrder = new OrderModel({ company_symbol, price });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 2. Read Orders
// 2.1. Get all orders
orderRouter.get("/", async (req, res) => {
    try {
        const orders = await OrderModel.find();
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 2.2. Get orders for a specific company
orderRouter.get("/company/:symbol", async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const orders = await OrderModel.find({ company_symbol: symbol });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders for company:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 3. Delete Order
orderRouter.delete("/:id", async (req, res) => {
    try {
        const orderId = req.params.id;
        // Check if the order with the given ID exists
        const existingOrder = await OrderModel.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        // Delete the order
        await OrderModel.findByIdAndDelete(orderId);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = {orderRouter};
