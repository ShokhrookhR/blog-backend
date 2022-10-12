import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import CommentModel from '../models/Comment.js';

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: req.postId,
    });
    const comments = await doc.save(); //Сохраняем документ в БД
    res.json(comments);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Не удалось создать Комментарий',
    });
  }
};
export const getByPostId = async (req, res) => {
  const postId = req.params.id;
  try {
    const comments = await CommentModel.find({ post: postId })
      .populate('user')
      .populate('post')
      .exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Не удалось найти комментарии',
    });
  }
};
export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user').populate('post').exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Не удалось найти комментарии',
    });
  }
};
export const getLastComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().limit(5).exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Не удалось найти комментарии',
    });
  }
};

