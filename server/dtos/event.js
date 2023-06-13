module.exports = class EventDTO {
  userId;
  id;
  title;
  start;
  end;

  constructor(model) {
    this.userId = model.userId;
    this.id = model._id;
    this.title = model.title;
    this.start = model.start;
    this.end = model.end;
  }
};
