import userModel from "../Models/userModel.js";
import orderModel from "../Models/orderModel.js"
import {comparePassword, hasPassword} from "../Helpers/authHelper.js";
import JWT from "jsonwebtoken"


//Register Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, key } = req.body;
    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!key) {
      return res.send({ message: "Key is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered please login",
      });
    }
    //register user
    const hashed = await hasPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      key,
      password: hashed,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

//POst Login 
export const loginController = async(req,res) => {
      try{
            const {email, password} = req.body;
            //Validation
            if(!email || !password)
            {
                  return res.status(404).send({
                        success:false,
                        message:'Invalid email or Password' 
                  })
            }
            // Check user
            const user = await userModel.findOne({email})
            if(!user){
                  return res.status(404).send({
                        success:false,
                        message:'Email is not registered'
                  })
            }
            // user.password is hashed password and password is entered by the end client
            const match = await comparePassword(password, user.password)
            if(!match)
            {
                  return res.status(200).send({
                        success:false,
                        message:'Invalid Password'
                  })
            }
            // Token
            const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})
            res.status(200).send({
              success:true,
              message:"Login Successfully",
              user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role: user.role,
              },
              token,
            })
      } catch(error){
            console.log(error);
            res.status(500).send({
                  success:false,
                  message:'Error in Login',
                  error
            })
      }
}

// Forgot Password Controller
export const forgotPasswordController = async(req, res) => {
  try{
    const {email, key, newPassword} = req.body
    if(!email){
      res.status(400).send({message: 'Email is required'})
    }
    if(!key){
      res.status(400).send({message: 'Key is required'})
    }
    if(!newPassword){
      res.status(400).send({message: 'Please enter New Password'})
    }

    //Check
    const user = await userModel.findOne({email, key});

    //validation
    if(!user)
    {
      return res.status(404).send({
        success:false,
        message:'Wrong Email or Key'
      })
    }
    const hashed = await hasPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, {password: hashed});
    res.status(200).send({
      success:true,
      message: "Password Reset Successfully"
    })
    
  } catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Something went wrong',
      error
    })
  }
};

//Test controller
export const testController = (req,res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (!password) {
      return res.json({ error: "Passsword is required" });
    }
    const hashedPassword = password ? await hasPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};