import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  location: { type: String },
  rating: { type: Number, min: 1, max: 5 },
});

export const RecipeModel = mongoose.model("recipe", RecipeSchema);
