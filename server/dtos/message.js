module.exports = class MessageDTO {
  id;
  sender;
  recipient;
  content;

  constructor(model) {
    this.id = model._id;
    this.sender = model.sender;
    this.recipient = model.recipient;
    this.content = model.content;
  }
};
