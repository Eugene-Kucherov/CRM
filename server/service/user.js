const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const tokenService = require("./token");
const UserDto = require("../dtos/user");
const nodemailer = require("nodemailer");

class UserService {
  async sendActivationEmail(userEmail, userId) {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: {
        user: "nordlicht_crm@mail.ru",
        pass: "WMN5TyUNP3kw6LMtvwyT",
      },
    });

    const activationLink = `http://localhost:3000/activate/${userId}`;

    const mailOptions = {
      from: "nordlicht_crm@mail.ru",
      to: userEmail,
      subject: "Account Activation",
      text: `Please click the link to activate your account: ${activationLink}`,
      html: `<p>Please click the link to activate your account: <a href="${activationLink}">${activationLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
  }

  async registration(name, email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw new Error("User with this email already exists");
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      id: userDto.id,
      user: userDto,
    };
  }
  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User with this email does not exist");
    }

    if (user.blockedUntil && user.blockedUntil > Date.now()) {
      const remainingTime = Math.ceil(
        (user.blockedUntil - Date.now()) / 1000 / 60
      );
      throw new Error(
        `You are blocked. Please try again in ${remainingTime} minutes`
      );
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      if (user.count == 3) {
        const blockedUntil = new Date(Date.now() + 5 * 60 * 1000);
        await UserModel.updateOne({ email }, { blockedUntil, count: 0 });
        throw new Error("You are blocked. Please try again in 5 minutes");
      }
      await UserModel.updateOne({ email }, { count: user.count + 1 });
      throw new Error("Incorrect password");
    }

    await UserModel.updateOne({ email }, { blockedUntil: null, count: 0 });
    const userDto = new UserDto(user);
    const token = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, token.refreshToken);

    return {
      ...token,
      user: userDto,
    };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error("You are not authorized");
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new Error("You are not authorized");
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const token = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, token.refreshToken);

    return {
      ...token,
      user: userDto,
    };
  }
  async checkAuth(token) {
    if (!token) {
      throw new Error("You are not authorized");
    }
    const accessToken = token.split(" ")[1];
    if (!accessToken || !tokenService.validateAccessToken(accessToken)) {
      throw new Error("You are not authorized");
    }
  }

  async getUser(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("An error occurred while loading data");
    }
    const userDto = new UserDto(user);
    return userDto;
  }

  async updateUser(id, field, value) {
    const user = await UserModel.findById(id);

    user[field] = value;
    await user.save();

    const updatedUser = await UserModel.findById(id);
    const userDto = new UserDto(updatedUser);
    return userDto;
  }

  async deleteUser(id) {
    await UserModel.findByIdAndDelete(id);
  }
}

module.exports = new UserService();
