import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import PostModel from '../models/Post.js';

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      // создаём документ
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(','),
      user: req.userId,
      imageUrl: req.body.imageUrl,
    });
    const posts = await doc.save(); //Сохраняем документ в БД
    res.json(posts);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Не удалось найти пост',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Не удалось создать пост',
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 }, //viewsCount будет увеличиваться на один при каждом просмотре
      },
      {
        returnDocument: 'after', //Нам будет показан обновлённый viewCount
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Не удалось вернуть пост',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Не удалось найти пост',
          });
        }
        res.json(doc);
      },
    ).populate('user');
  } catch (error) {
    return res.status(500).json({
      message: 'Не удалось получить пост',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndRemove(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Не удалось удалить пост',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Не удалось найти пост',
          });
        }
        res.json({ success: true });
      },
    );
  } catch (error) {
    return res.status(500).json({
      message: 'Не удалось удалить пост',
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags.split(','),
        user: req.userId,
        imageUrl: req.body.imageUrl,
      },
    );
    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Не удалось обновить пост',
    });
  }
};
export const lastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts.map((post) => post.tags.flat().slice(0, 5));
    res.json(tags);
  } catch (error) {
    return res.status(500).json({
      message: 'Не удалось вернуть теги',
    });
  }
};