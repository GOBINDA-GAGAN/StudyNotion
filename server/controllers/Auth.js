const User = require("../models/User");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const Profile = require("../models/Profile");
const Jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { route, options } = require("../routes/User.routes");
dotenv.config();

//sendOTP
exports.sendOTP = async (req, res) => {
  try {
    //? fetch email from body
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      res
        .status(401)
        .json({ success: false, message: "user already register" });
    }

    // ? otp otp-generator

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("otp:", otp);

    //check unique otp
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // create an  entry in  database

    const otpBody = await OTP.create(otpPayload);

    res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      otp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//signUp
exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      confirmPassword,
      otp,
    } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist",
      });
    }
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All field are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does't match,please try again",
      });
    }

    // mostRecent otp
    // Await the result
    const mostRecentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

    console.log("Most recent OTP record:", mostRecentOTP);

    // Check if OTP record exists
    if (!mostRecentOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // Compare OTP values
    if (mostRecentOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ProfileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp,
      contactNumber,
      additionalDetails: ProfileDetails._id,
      image: `https://api.dicebear.com/9.x/bottts/jpg`,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All field required",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not register, please signup first",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        accountType: user.accountType,
        id: user._id,
      };
      const token = Jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

      (user.token = token), (user.password = undefined);

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Login in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failure,please try again",
      error: error.message,
    });
  }
};

//changePassword
exports.changePassword = async () => {
  try {
    const { oldPassword,newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
      res.status(401).json({
        success: false,
        message: "All failed Require",
      });
    }

    ActiveXObjectcnm,.
    


  } catch (error) {
    res.status(500).json({
      success: false,
      message: "change password failed",
      error: error.message,
    });
  }
};
