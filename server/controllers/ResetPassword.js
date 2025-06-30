const User = require("../models/User");

const mailSender = require("../utils/mailSender");

//resetPasswordToken 😊 forgot Password
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User is not exist",
      });
    }

    const token = crypto.randomUUID();

    const UpdateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordToken: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true,
      }
    );

    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(email, "Password Reset Link", url);

    return res.status(200).json({
      success: false,
      message: "Email send successfully,click the link and  reset password",
      error: error.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//resetPassword
