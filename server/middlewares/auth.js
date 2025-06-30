const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is message",
      });
    }

    // verify token

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
  try {
  if(req.user.accountType!=="Student"){
    return res.status(401).json({
      success:false,
      message:"this is a protect route for student only"
    })
  }
  next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "user role can't verify",
      error: error.message,
    });
  }
};

//isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
  if(req.user.accountType!=="Instructor"){
    return res.status(401).json({
      success:false,
      message:"this is a protect route for Instructor only"
    })
  }
  next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "user role can't verify",
      error: error.message,
    });
  }
};

//isAdmin

exports.isAdmin= async (req, res, next) => {
  try {
  if(req.user.accountType!=="Admin"){
    return res.status(401).json({
      success:false,
      message:"this is a protect route for Admin only"
    })
  }
  next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "user role can't verify",
      error: error.message,
    });
  }
};
