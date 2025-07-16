const Profile = require("../models/Profile");
const User = require("../models/User");

//update  profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender,
    } = req.body;
    const id = req.user.id;
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        status: false,
        message: "all field required",
      });
    }

    const userDetails = await User.findById(id);
    const profileId = User.additionalDetails;

    const profileDetails = await Profile.findById(profileId);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    return res.status(200).json({
      status: true,
      message: "profile update successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error from updateProfile",
      error: error.message,
    });
  }
};

// delete account

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      res.status(400).json({
        status: false,
        massage: "user not found",
      });
    }

    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    await User.findByIdAndDelete({ _id: id });

    //Todo delete the studentsEnrolled form  enrolled course
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error from updateProfile",
      error: error.message,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id).populate("additionalDetails");

    return res.status(200).json({
      success: true,
      message: "User Data fetched",
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error from updateProfile",
      error: error.message,
    });
  }
};
