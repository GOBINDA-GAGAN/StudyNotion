const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create
exports.createSubsection = async (req, res) => {
  try {
    const { title, description, sectionId, timeDuration } = req.body;

    const video = req.files.videoFile;
    if (!title || !title || !description || !sectionId || !timeDuration) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video
    const videoUrl = await uploadImageToCloudinary(
      video,
      process.env.Folder_Name
    );

    const newSubSection = await Section.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      video: videoUrl.secure_url,
    });

    const updateSection = await Section.findByIdAndUpdate(
      {
        _id: sectionId,
      },
      {
        $push: {
          SubSection: newSubSection._id,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "subSection  add successfully",
      updateSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// update

exports.updateSubsection = async (req, res) => {};

//delete
exports.deleteSubsection = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(402).json({
      message: "id not found",
      status: false,
    });
  }
  const deleteSubsection = await SubSection.findByIdAndDelete(id);
  req.status(200).json({
    status: true,
    message: "Subsection delete successfully",
    deleteSubsection,
  });
};
