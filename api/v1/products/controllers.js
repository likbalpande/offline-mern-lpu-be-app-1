const { Product } = require("../../../models/product_schema.js");

const createProductController = async (req, res) => {
    try {
        const data = req.body;
        console.log("creating product...", data);

        Object.keys(data).forEach((key) => {
            if (data[key] == null || data[key] == "") {
                delete data.key;
            }
        });

        let newProduct = await Product.create(data);
        res.status(201).json({
            isSuccess: true,
            message: `Product created`,
            data: {
                product: newProduct,
            },
        });
    } catch (err) {
        console.log("🔴 Error in createProductController", err.message);

        if (err.name === "ValidationError" || err.code == "11000") {
            res.status(400).json({ isSuccess: false, message: `Err: ${err.message}`, data: {} });
        }

        res.status(500).json({ isSuccess: false, message: "Internal Server Error", data: {} });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.status(200).json({
            isSuccess: true,
            message: "Product list fetched!",
            data: {
                products: allProducts,
            },
        });
    } catch (err) {
        console.log("🔴 Error in getALlProducts -->", err.message);
        res.status(500).json({ isSuccess: false, message: "Internal Server Error", data: {} });
    }
};

const updateProductController = async (req, res) => {
    try {
        const { productId } = req.params;
        const newData = req.body;

        const newProduct = await Product.findByIdAndUpdate(productId, newData, {
            new: true,
            runValidators: true,
        });

        if (newProduct === null) {
            res.status(400);
            res.json({
                isSuccess: false,
                message: "Invalid product Id",
                data: {},
            });
            return;
        }

        res.status(200).json({
            isSuccess: "true",
            message: "Product updated",
            data: {
                product: newProduct,
            },
        });
    } catch (err) {
        console.log("🔴 Error in updateProductController -->", err.message);
        res.status(500).json({ isSuccess: false, message: "Internal Server Error", data: {} });
    }
};

module.exports = { updateProductController, createProductController, getAllProducts };
