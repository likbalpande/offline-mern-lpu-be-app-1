const { UserModel } = require("../../../models/user_schema");

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
    // to be continued...
};

module.exports = { userRegistrationController, userLoginController };
