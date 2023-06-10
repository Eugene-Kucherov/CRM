const PhotoService = require("../service/photo");

class PhotoController {
  async uploadPhoto(req, res) {
    try {
      const file = req.file;
      const { userId } = req.params;

      const uploadedPhoto = await PhotoService.uploadPhoto(file, userId);
      return res.status(200).json(uploadedPhoto);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getPhoto(req, res) {
    try {
      const { userId } = req.params;

      const photo = await PhotoService.getPhotoByUserId(userId);
      return res.status(200).json(photo);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async deletePhoto(req, res) {
    try {
      const { userId } = req.params;
      await PhotoService.deletePhotoByUserId(userId);
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PhotoController();
