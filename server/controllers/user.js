const UserService = require("../service/user");
const TokenService = require("../service/token");
const DealService = require("../service/deal");
const PhotoService = require("../service/photo");
const EventService = require("../service/event");
const UserModel = require("../models/user");

class UserController {
  async activateAccount(req, res) {
    try {
      const { userId } = req.params;
      await UserModel.findByIdAndUpdate(userId, { isActivated: true });
      return res.sendStatus(200);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async registration(req, res) {
    try {
      const { name, email, password } = req.body;
      const userData = await UserService.registration(name, email, password);

      await UserService.sendActivationEmail(email, userData.id);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {
      res.status(400).json({ error: "Failed to logout" });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async checkAuth(req, res, next) {
    try {
      const token = req.header("Authorization");
      await UserService.checkAuth(token);
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUser(userId);
      return res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { field, value } = req.body;
      const updatedUser = await UserService.updateUser(userId, field, value);
      return res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: "Failed to update detailes" });
    }
  }

  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const { refreshToken } = req.cookies;
      await UserService.deleteUser(userId);
      await TokenService.removeToken(refreshToken);
      await PhotoService.deletePhotoByUserId(userId);
      await EventService.deleteEventsByUserId(userId);
      await DealService.deleteDealsByUserId(userId);
      return res.sendStatus(200);
    } catch (error) {
      res.status(404).json({ error: "Failed to delete your account" });
    }
  }
}

module.exports = new UserController();
