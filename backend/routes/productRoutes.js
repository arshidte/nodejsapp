import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";

import Product from "../models/productModel.js";

// GET all products
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    console.log(products);
    if (products) {
      res.status(200);
      res.json(products);
    } else {
      res.status(400);
      throw new Error("No data found");
    }
  })
);

export default router;
