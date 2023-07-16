module.exports = class MessageDTO {
  id;
  sender;
  recipient;
  content;
  created_at;
  is_deleted;

  constructor(model) {
    this.id = model._id;
    this.sender = model.sender;
    this.recipient = model.recipient;
    this.content = model.content;
    this.created_at = model.created_at;
    this.is_deleted = model.is_deleted;
  }
};
