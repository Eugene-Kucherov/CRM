module.exports = class UserDto {
  name;
  email;
  phone;
  address;
  id;
  isActivated;

  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this.phone = model.phone;
    this.address = model.address;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
};
