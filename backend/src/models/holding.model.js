import mongoose from "mongoose";

const holdingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity cannot be negative"]
    },
    avgPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

holdingSchema.index({ user: 1, symbol: 1 }, { unique: true });

export const Holding = mongoose.model("Holding", holdingSchema);