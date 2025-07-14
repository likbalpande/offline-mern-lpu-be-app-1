const jwt = require("jsonwebtoken");

const getUserDetailsController = async (req, res) => {
    try {
        const { authorization } = req.cookies;
        console.log("authorization-->", authorization);
        if (!authorization) {
            res.status(401).json({ isSuccess: false, message: "Token not found!" });
        }
        console.log("secret-->", process.env.JWT_SECRET);

        jwt.verify(authorization, process.env.JWT_SECRET, function (err, decodedData) {
            if (err) {
                res.status(401).json({
                    isSuccess: false,
                    message: "Invalid token!",
                    data: {},
                });
            } else {
                res.status(200).json({
                    isSuccess: true,
                    message: "Invalid token!",
                    data: {
                        user: decodedData,
                    },
                });
            }
        });
    } catch (err) {
        console.log("error in getUserDetailsController -->", err.message);
        res.status(500).json({ isSuccess: false, message: "Internal Server Error", data: { message: err.message } });
    }
};

module.exports = { getUserDetailsController };
