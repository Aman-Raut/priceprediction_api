import { RecipeModel } from "../models/Room.js";
import { UserModel } from "../models/User.js";
import express from "express";

const router = express.Router();
router.post("/", async (req, res) => {
  const recipe = new RecipeModel(req.body);
  try {
    const response = await recipe.save();
    res.json({ message: "success" });
  } catch (error) {
    return res.json({ message: "error" });
  }
});


router.get("/room", async (req, res) => {
  try {
    const { price,location } = req.query;
    // console.log(req.query,";lkjhgf")

    if (!price) {
      return res.json({ message: "Please provide some range" });
    }

    // const roomprice = parseFloat(price);

    const pgRooms = await RecipeModel.find({
      price: { $lte: price },
      location: location
    });
    console.log(pgRooms)

    res.json(pgRooms);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.json(response);
  } catch (error) {
    return res.json(error);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    console.log(req.body)
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findByIdAndUpdate(id , {$push : {savedRecipe:recipe} }, {new:true});

    res.json(user);
  } catch (error) {
    return res.json(error);
  }
});

router.get("/savedRecipe/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipe = await RecipeModel.find({
      _id: { $in: user.savedRecipe },
    });
    res.json(savedRecipe);
  } catch (error) {
    res.json(error);
  }
});



export { router as recipeRouter };