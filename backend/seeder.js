import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import users from "./data/users.js";
import products from './data/products.js'

import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Cart from "./models/cartModel.js";


dotenv.config();

await connectDB();

const importData = async () => {
  try {
    // await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const createdProducts = await Product.insertMany(products);

    const sampleUser = createdUsers[0]._id;
    const sampleProduct = createdProducts[0]._id;

    const sampleCart = {
      user: sampleUser,
      items: [
        {
          product: sampleProduct,
          quantity: 2,
        },
      ],
    };

    const createdCart = await Cart.insertMany(sampleCart);

    console.log("Data imported");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();

    console.log("Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if(process.argv[2] === '-id'){
    destroyData();
}else{
    importData();
}