module.exports = class MessageDTO {
  id;
  sender;
  recipient;
  content;
  created_at;
  updated_at;
  is_deleted;
  is_read;
  dialogue;

  constructor(model) {
    this.id = model._id;
    this.sender = model.sender;
    this.recipient = model.recipient;
    this.content = model.content;
    this.created_at = model.created_at;
    this.updated_at = model.updated_at;
    this.is_deleted = model.is_deleted;
    this.is_read = model.is_read;
    this.dialogue = model.dialogue;
  }
};
