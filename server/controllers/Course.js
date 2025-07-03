const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/tags");
const uploadImageToCloudinary = require("../utils/imageUploader");

//Add course
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

// show all course
exports.showCourse = async (req, res) => {
  try {
    const AllCourses = await Course.find({},{
      courseName:true,price:true,thumbnail:true, instructor:true,ratingAndReviews:true,studentsEnrolled:true
    }).populate("instructor").exec();

    if (!AllCourses) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: AllCourses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// show course by id
exports.showCourse = async (req, res) => {
  try {
    const { id } = req.params; 

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

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

