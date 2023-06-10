const DealModel = require("../models/deal");
const DealDto = require("../dtos/deal");

class DealService {
  async createDeal(dealData) {
    const deal = await DealModel.create(dealData);
    const dealDto = new DealDto(deal);
    return {
      deal: dealDto,
    };
  }
  async getDeals(userId) {
    const deals = await DealModel.find({ userId });
    const dealDtos = deals.map((deal) => new DealDto(deal));
    return dealDtos;
  }
  async getDeal(id) {
    const deal = await DealModel.findById(id);

    const dealDto = new DealDto(deal);
    return dealDto;
  }
  async updateDeal(id, field, value) {
    const deal = await DealModel.findById(id);

    deal[field] = value;
    await deal.save();

    const updatedDeal = await DealModel.findById(id);
    const dealDto = new DealDto(updatedDeal);
    return dealDto;
  }
  async deleteDealsByUser(userId) {
    await DealModel.deleteMany({ userId: userId });
  }
  async deleteDeal(id) {
    await DealModel.findByIdAndDelete(id);
  }
}

module.exports = new DealService();
