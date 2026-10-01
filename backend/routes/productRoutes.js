const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a product
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Update a product - Admin only
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
// Delete a product - Admin only
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
// Upload product image - Admin only
router.post(
    "/upload-image",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "No image uploaded"
                });
            }

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "shopeasy/products",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                stream.end(req.file.buffer);
            });

            res.json({
                message: "Image uploaded successfully",
                imageUrl: result.secure_url
            });
        } catch (error) {
            console.error("Cloudinary upload error:", error);

            res.status(500).json({
                message: "Image upload failed"
            });
        }
    }
);

module.exports = router;