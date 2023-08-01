import JWT from "jsonwebtoken";
import userModel from "../Models/userModel.js"
// Protected Routes Token base
export const requireSignIn = async (req,res,next) => {
      try{
            const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
            req.user = decode;
            next();
      } catch(error){
            console.log(error);
      }
}

// client ka token "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDRjYjBkZWRlMTliYzRiNzE1ZWE2MGIiLCJpYXQiOjE2ODYyMDc0ODYsImV4cCI6MTY4NjgxMjI4Nn0.18VsADswYQM1rApM9yBh17ivzQm3gS0v31g4tSqaQiY" server ne banaya hain server ke pass ye bhi hain or jwt secret token bhi hain


//admin acceess
export const isAdmin = async (req, res, next) => {
  try{
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch(error){
    console.log(error);
    res.status(401).send({
      success:false,
      error,
      meessage:"Error in Admin Middleware",
    });
  };
}
