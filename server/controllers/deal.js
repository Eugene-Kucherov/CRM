const DealService = require("../service/deal");

class DealController {
  async createDeal(req, res) {
    try {
      const dealData = await DealService.createDeal(req.body);
      return res.json(dealData);
    } catch (error) {
      res.status(500).json({ error: "Failed to create deal" });
    }
  }
  async getDeals(req, res) {
    try {
      const { userId } = req.params;
      const deals = await DealService.getDeals(userId);
      return res.json(deals);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while loading data" });
    }
  }
  async getDeal(req, res) {
    try {
      const { dealId } = req.params;
      const deal = await DealService.getDeal(dealId);
      return res.json(deal);
    } catch (error) {
      res.status(404).json({ error: "Deal not found" });
    }
  }
  async updateDeal(req, res) {
    try {
      const { dealId } = req.params;
      const { field, value } = req.body;
      const updatedDeal = await DealService.updateDeal(dealId, field, value);
      return res.json(updatedDeal);
    } catch (error) {
      res.status(400).json({ error: "Failed to update detailes" });
    }
  }
  async deleteDeal(req, res) {
    try {
      const { dealId } = req.params;
      await DealService.deleteDeal(dealId);
      return res.sendStatus(200);
    } catch (error) {
      res.status(404).json({ error: "Failed to delete this deal" });
    }
  }
}

module.exports = new DealController();
