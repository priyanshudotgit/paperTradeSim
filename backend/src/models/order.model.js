import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["BUY", "SELL"],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"]
    },
    tradedPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "EXECUTED", "REJECTED"],
        default: "EXECUTED" 
    }
}, {timestamps: true});

export const Order = mongoose.model("Order", orderSchema);