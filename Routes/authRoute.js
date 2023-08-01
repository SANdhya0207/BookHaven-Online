import express  from "express";
import {registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from '../Controllers/authController.js'
import { isAdmin, requireSignIn } from "../Middlewares/authMiddle.js";
// Router Object
const router = express.Router()

//Routing
//Register || Method Post
router.post('/register', registerController);

//lOGIN
router.post('/login', loginController);

// Forgot Password || Post 
router.post('/forgotPassword', forgotPasswordController)


//test routes
router.get('/test', requireSignIn, isAdmin, testController);

//Protected User Route Auth
router.get('/user-auth', requireSignIn, (req, res) => {
      res.status(200).send({ok:true});
})

//Protected Admin Route Auth
router.get('/admin-auth', requireSignIn, isAdmin,  (req, res) => {
      res.status(200).send({ok:true});
})
//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;