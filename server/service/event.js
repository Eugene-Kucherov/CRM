const EventModel = require("../models/event");
const EventDto = require("../dtos/event");

class EventService {
  async createEvent(eventData) {
    const event = await EventModel.create(eventData);
    const eventDto = new EventDto(event);
    return {
      event: eventDto,
    };
  }
  async getEvents(userId) {
    const events = await EventModel.find({ userId });
    const eventDtos = events.map((event) => new EventDto(event));
    return eventDtos;
  }
  async deleteEventsByUserId(userId) {
    await EventModel.deleteMany({ userId: userId });
  }
  async deleteEvent(id) {
    await EventModel.findByIdAndDelete(id);
  }
}

module.exports = new EventService();
