const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/tags");
const uploadImageToCloudinary = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    const thumbnail = req.fills.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "All field  are required",
      });
    }

    const userId = req.user.id;
    const instructorDetails = await User.findOne(userId);
    console.log(instructorDetails);

    if (!instructorDetails) {
      return req.status(404).json({
        success: false,
        message: "Instructor Not found",
      });
    }

    const tagDetails = await Tag.findById({ tag });
    if (!tagDetails) {
      return req.status(404).json({
        success: false,
        message: "TagDetails Not found",
      });
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.Folder_Name
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    await User.findById(
      { _id: instructorDetails._id },
      {
        $push: {
          Course: newCourse._id,
        },
      }
    );

    //update tag

    return res.status(200).json({
      success: true,
      message: "Course update successfully",
      newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



exports.showCourse = async (req, res) => {
  try {
    const { id } = req.params; 

    const course = await Course.findById(id);

    

    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

