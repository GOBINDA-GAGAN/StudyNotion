const express = require("express");
const { sendOTP,signUp, login } = require("../controllers/Auth");
const userRouter=express.Router();


userRouter.post("/signup",signUp )
userRouter.post("/verify-otp",sendOTP)
userRouter.post("/login",login)






module.exports=userRouter;