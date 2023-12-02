const PhotoModel = require("../models/photo");
const PhotoDTO = require("../dtos/photo");
const fs = require("fs");
const sharp = require("sharp");
const DialogueModel = require("../models/dialogue");

class PhotoService {
  async uploadPhoto(file, userId) {
    const existingPhoto = await PhotoModel.findOne({ userId });

    if (existingPhoto) {
      await PhotoModel.findByIdAndDelete(existingPhoto._id);
    }

    const resizedImageBuffer = await sharp(file.path)
      .resize({ width: 600, height: 500 })
      .jpeg({ quality: 50 })
      .toBuffer();

    const photo = new PhotoModel({
      userId: userId,
      fileName: file.filename,
      photoData: resizedImageBuffer,
      contentType: file.mimetype,
    });

    const uploadedPhoto = await photo.save();

    if (!uploadedPhoto) {
      throw new Error("Failed to upload photo");
    }

    fs.unlinkSync(file.path);

    await this.updateUserPhotoInDialogues(
      userId,
      file.mimetype,
      resizedImageBuffer
    );

    return new PhotoDTO(uploadedPhoto);
  }

  async updateUserPhotoInDialogues(userId, contentType, photoData) {
    try {
      const dialogues = await DialogueModel.find({
        "dialoguePartners.user": userId,
      });

      for (const dialogue of dialogues) {
        const partnerToUpdate = dialogue.dialoguePartners.find(
          (partner) => partner.user.toString() === userId
        );

        if (partnerToUpdate) {
          partnerToUpdate.photo =
            contentType && photoData
              ? `data:${contentType};base64,${photoData.toString("base64")}`
              : null;
        }

        await dialogue.save();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getPhotoByUserId(userId) {
    const photo = await PhotoModel.findOne({ userId });

    if (!photo) {
      return null;
    }

    return {
      fileName: photo.fileName,
      photoData: `data:${photo.contentType};base64,${photo.photoData.toString(
        "base64"
      )}`,
    };
  }

  async deletePhotoByUserId(userId) {
    const photo = await PhotoModel.findOneAndDelete({ userId });

    if (photo) {
      await this.updateUserPhotoInDialogues(userId, null, null);
    }
  }
}

module.exports = new PhotoService();
