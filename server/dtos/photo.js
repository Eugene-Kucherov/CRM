module.exports = class PhotoDTO {
  fileName;
  photoData;

  constructor(model) {
    this.fileName = model.fileName;
    this.photoData = model.photoData;
  }
};
