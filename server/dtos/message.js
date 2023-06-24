module.exports = class MessageDTO {
  id;
  sender;
  recipient;
  content;
  created_at;

  constructor(model) {
    this.id = model._id;
    this.sender = model.sender;
    this.recipient = model.recipient;
    this.content = model.content;
    this.created_at = model.created_at;
  }
};
