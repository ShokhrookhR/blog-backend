import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
      fullName: req.body.fullName,
    });
    const user = await doc.save(); //Сохраняяем в БД

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'macha',
      {
        expiresIn: '30d', //Срок жизни 30 дней
      },
    ); //Создаём токен, внутри будет только id.
    const { passwordHash, ...userData } = user._doc;
    res.json({
      success: true,
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Не удалось зарегистрироваться' });
  }
};
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'Не удалось найти пользователя' });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); // Сравниваем пароль в запросе, с паролями в БД
    if (!isValidPass) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'macha',
      {
        expiresIn: '30d',
      },
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      success: true,
      ...userData,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(403).json({
        message: 'Не доступа',
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
export const remove = async (req, res) => {
  try {
    const userId = req.params.id;
    UserModel.findByIdAndRemove(
      {
        _id: userId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Не удалось удалить пользователя',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Не удалось найти пользователя',
          });
        }
        res.json({ success: true });
      },
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Нет удалось удалить пользователя',
    });
  }
};