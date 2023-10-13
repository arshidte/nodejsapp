import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";

import Cart from "../models/cartModel.js";
import { protect } from "../middleware/authMiddleware.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// GET products in cart based on userID
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const user = req.user;

    const cartItems = await Cart.find({ user: user._id });
    console.log(cartItems);
    if (cartItems.length > 0) {
      res.status(200);
      res.json(cartItems);
    } else {
      res.status(400);
      throw new Error("Cart is empty!");
    }
  })
);

// Add products to cart
router.post(
  "/addtocart/:productId/:quantity",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
    const requestedQuantity = parseInt(req.params.quantity);
    console.log(requestedQuantity);

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) {
      res.status(404);
      throw new Error("User not found. Check if you are logged in!");
    }
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (requestedQuantity > product.quantity) {
      res.status(400);
      throw new Error("Requested quantity is greater than stock available!!!");
    } else {
      product.quantity = product.quantity - requestedQuantity;
      product.save();
    }

    const cart = await Cart.findOne({ user: userId });

    const price = requestedQuantity * product.price;

    const cartItem = {
      product: productId,
      quantity: requestedQuantity,
      price: price,
    };

    if (cart) {
      cart.items.push(cartItem);
      cart.totalPrice = cart.totalPrice + price;
      await cart.save();
    } else {
      const addtocart = await Cart.create({
        user: userId,
        items: cartItem,
        totalPrice: price,
      });
    }

    res.status(200).json({ message: "Item added to cart successfully" });
  })
);

// Remove it from the cart
router.delete(
  "/removefromcart/:productId",
  protect,
  asyncHandler(async (req, res) => {
    const productId = req.params.productId;

    const user = req.user._id;

    const cart = await Cart.findOne({ user });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      res.status(404);
      throw new Error("Item not found in the cart");
    }

    const removedItem = cart.items.splice(itemIndex, 1)[0];
    console.log(removedItem);

    cart.totalPrice -= removedItem.price;

    await cart.save();

    res
      .status(200)
      .json({ message: "Item removed from the cart successfully" });
  })
);

// GET total price of the cart
router.get(
    "/gettotal",
    protect,
    asyncHandler(async (req, res) => {
      const user = req.user;
  
      const cart = await Cart.find({ user: user._id });
      console.log(cart);
      if (cart.length > 0) {
        res.status(200);
        res.json(cart.totalPrice);
      } else {
        res.status(400);
        throw new Error("Cart is empty!");
      }
    })
  );

export default router;
