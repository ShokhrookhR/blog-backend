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
export const getAll = async (req, res) => {
  const postId = req.body.postId;
	try {
	  const posts = await CommentModel.find({ post: postId })
      .populate('user')
      .populate('post')
      .exec();
	  res.json(posts);
	} catch (error) {
	  console.log(error);
	  return res.status(500).json({
		 message: 'Не удалось найти комментарии',
	  });
	}
 };

