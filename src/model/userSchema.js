import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    discordUserId: {
        type: String,
        required: true
    },
    discordUsername: {
        type: String,
        required: true
    },
    chessComUsername: {
        type: String,
    },
    lichessUsername: {
        type: String,
    }
})

export const User = mongoose.model('User', userSchema);