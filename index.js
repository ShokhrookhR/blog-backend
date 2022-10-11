import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import { registerValidation, loginValidation, postValidation, commentValidation } from './validations/validations.js';
import checkMe from './utils/checkMe.js';
import { handleValidationsErrors } from './utils/handleValidationsError.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import * as CommentController from './controllers/CommentController.js';
import checkPost from './utils/checkPost.js';

const start = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI,{ useNewUrlParser: true })
      .then(() => {
        console.log('DB Ok');
      })
      .catch((err) => {
        console.log('DB Error', err);
      });
    app.listen(process.env.PORT || 4444, (err) => {
      if (err) {
        return console.log(err);
      } else {
        console.log('Server OK');
      }
    });
  } catch (error) {
    console.log('DB Error', error);
  }
};
dotenv.config();
const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/auth/register', registerValidation, handleValidationsErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationsErrors, UserController.login);
app.get('/auth/me', checkMe, UserController.getMe);
app.get('/users', UserController.getAll);
app.get('/users/:id', UserController.getOne);
app.delete('/users/:id', checkMe, UserController.remove);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkMe, postValidation, handleValidationsErrors, PostController.create);
app.delete('/posts/:id', checkMe, PostController.remove);
app.patch('/posts/:id', checkMe, postValidation, handleValidationsErrors, PostController.update);
app.get('/tags', PostController.lastTags);

app.post('/comments', checkMe,checkPost, commentValidation, handleValidationsErrors, CommentController.create);
app.get('/comments', CommentController.getAll);


app.post('/upload', checkMe, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});


start();