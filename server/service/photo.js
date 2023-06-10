const PhotoModel = require("../models/photo");
const PhotoDTO = require("../dtos/photo");
const fs = require("fs");

class PhotoService {
  async uploadPhoto(file, userId) {
    const existingPhoto = await PhotoModel.findOne({ userId });

    if (existingPhoto) {
      await PhotoModel.findByIdAndDelete(existingPhoto._id);
    }

    const photo = new PhotoModel({
      userId: userId,
      fileName: file.filename,
      photoData: fs.readFileSync(file.path),
      contentType: file.mimetype,
    });

    const uploadedPhoto = await photo.save();

    if (!uploadedPhoto) {
      throw new Error("Failed to upload photo");
    }

    fs.unlinkSync(file.path);

    return new PhotoDTO(uploadedPhoto);
  }

  async getPhotoByUserId(userId) {
    const photo = await PhotoModel.findOne({ userId });

    if (!photo) {
      return null;
    }

    const base64Data = photo.photoData.toString("base64");
    const photoData = `data:${photo.contentType};base64,${base64Data}`;

    return { fileName: photo.fileName, photoData };
  }

  async deletePhotoByUserId(userId) {
    await PhotoModel.findOneAndDelete({ userId });
  }
}

module.exports = new PhotoService();
