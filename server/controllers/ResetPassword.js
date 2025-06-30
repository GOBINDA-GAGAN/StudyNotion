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
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    con;

    if (!password || !confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "password not matching",
      });
    }

    const userDetails = await User.findOne({ token: token });

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "token invalid",
      });
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status().json({
        status: false,
        message: "Token expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const passwordUpdated = await User.updateOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Password reset successfully",
      passwordUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
