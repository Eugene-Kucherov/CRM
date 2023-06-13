const EventService = require("../service/event");

class EventController {
  async createEvent(req, res) {
    try {
      const eventData = await EventService.createEvent(req.body);
      return res.json(eventData);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  }
  async getEvents(req, res) {
    try {
      const { userId } = req.params;
      const events = await EventService.getEvents(userId);
      return res.json(events);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while loading data" });
    }
  }
  async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;
      await EventService.deleteEvent(eventId);
      return res.sendStatus(200);
    } catch (error) {
      res.status(404).json({ error: "Failed to delete this event" });
    }
  }
}

module.exports = new EventController();
