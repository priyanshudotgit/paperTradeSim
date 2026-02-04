import mongoose, { Schema } from "mongoose";

const watchlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        default: "My Watchlist"
    },
    stocks: [
        {
            type: String,
            uppercase: true,
            trim: true
        }
    ]
}, { timestamps: true });

export const Watchlist = mongoose.model("Watchlist", watchlistSchema);