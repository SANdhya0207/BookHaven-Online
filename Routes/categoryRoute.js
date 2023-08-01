import express from "express";
import { isAdmin, requireSignIn } from './../Middlewares/authMiddle.js'
import { categoryController, createCategoryController, deleteCategoryCOntroller, singleCategoryController, updateCategoryController } from "../Controllers/categoryController.js";
const router = express.Router()

//Routes
router.post(
      '/create-category',
      requireSignIn,
      isAdmin,
      createCategoryController
);

// Update Category 
router.put(
      '/update-category/:id', 
       requireSignIn,
       isAdmin, 
       updateCategoryController)

//Get all Category
router.get('/get-category', categoryController)

//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryCOntroller
);

export default router;