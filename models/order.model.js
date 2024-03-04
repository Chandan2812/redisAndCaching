const mongoose=require("mongoose");

const orderSchema = mongoose.Schema({
    company_symbol: String,
    price: Number,
    time: { type: Date, default: Date.now },
});

const OrderModel=mongoose.model("order",orderSchema);

module.exports={OrderModel}