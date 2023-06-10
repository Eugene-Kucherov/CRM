module.exports = class DealDto {
  userId;
  id;
  stage;
  name;
  email;
  phone;
  company;
  website;
  created_at;
  updated_at;
  notes;

  constructor(model) {
    this.userId = model.userId;
    this.id = model._id;
    this.stage = model.stage;
    this.email = model.email;
    this.name = model.name;
    this.phone = model.phone;
    this.company = model.company;
    this.website = model.website;
    this.created_at = model.created_at;
    this.updated_at = model.updated_at;
    this.notes = model.notes;
  }
};
