import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    sku: {
      type: String,
      required: true,
      unique: true
    },

    category: {
      type: String,
      required: true
    },

    unit: {
      type: String,
      required: true,
      default: "piece"
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;