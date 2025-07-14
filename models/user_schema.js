const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            enum: ["male", "female"],
        },
        role: {
            type: String,
            enum: ["user", "admin", "super-admin"],
            default: "user",
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

// mongoose middleware
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password.toString(), 12);
    }
    next();
});

const UserModel = model("user", userSchema);

module.exports = { UserModel };
