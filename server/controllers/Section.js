const Course = require('../models/Course');
const Section =require('./Section')

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //  Create new section
    const newSection = await Section.create({ sectionName });

    //  Push section ID to course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      section: newSection,
      course: updatedCourse,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
