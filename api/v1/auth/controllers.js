const { UserModel } = require("../../../models/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegistrationController = async (req, res) => {
    try {
        const data = req.body;
        if (!data.email || !data.password) {
            // add more validation like regex check for email
            res.status(400).json({
                isSuccess: false,
                message: "Email & Password is required!",
                data: {},
            });
            return; // NEVER forgot to write return in such cases!
        }

        const newUser = await UserModel.create(data);

        // console.log("=>", newUser._doc);
        const { password, ...safeData } = newUser._doc;
        console.log("--->", safeData);

        res.status(201).json({
            isSuccess: true,
            message: "User created!",
            data: {
                user: safeData,
            },
        });
    } catch (err) {
        console.log("🔴 Error in userRegistrationController -->", err.message);
        if (err.name === "ValidationError" || err.code == "11000") {
            res.status(400).json({ isSuccess: false, message: `Err: ${err.message}`, data: {} });
        } else {
            res.status(500).json({ isSuccess: false, message: "Internal Server Error", data: {} });
        }
    }
};

const userLoginController = async (req, res) => {
    const data = req.body;
    if (!data.email || !data.password) {
        // some more validation
        res.status(400).json({ isSuccess: false, message: "Email and password is required", data: {} });
        return;
    }

    const user = await UserModel.findOne({
        // find --> querySelectorAll , findOne --> querySelector
        email: data.email,
    });

    if (user === null) {
        res.status(400).json({ isSuccess: false, message: "User doesn't exists! Please register!", data: {} });
        return;
    }

    const hashedPassword = user.password;
    const isCorrect = await bcrypt.compare(data.password, hashedPassword);
    if (!isCorrect) {
        res.status(400).json({ isSuccess: false, message: "Incorrect password!", data: {} });
        return;
    }

    const token = jwt.sign({ _id: user._id, email: user.email }, "my_secretnsgrsvfb#@%$kf");

    res.cookie("authorization", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "Strict",
    });

    res.status(200);
    res.json({
        isSuccess: true,
        message: "Login successful!",
        data: {
            user: {
                email: user.email,
            },
        },
    });
};

module.exports = {
    userRegistrationController,
    userLoginController,
};
