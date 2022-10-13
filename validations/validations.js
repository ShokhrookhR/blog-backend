import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат Электронной почты').isEmail(),
  body('password', 'Пароль должен состоять минимум из 5 символов').isLength({ min: 5 }),
  body('fullName', 'Имя должно состоять минимум из 3 символов').isLength({ min: 3 }),
  body('avatarUrl').optional().isURL(),
];
export const loginValidation = [
  body('email', 'Неверный формат Электронной почты').isEmail(),
  body('password', 'Пароль должен состоять минимум из 5 символов').isLength({ min: 5 }),
];

export const postValidation = [
  body('title', 'Заглавие должно состоять минимум из 3 символов').isLength({ min: 3 }).isString(),
  body('text', 'Текст должен состоять минимум из 5 символов').isLength({ min: 5 }).isString(),
  body('tags').optional().isString(),
  body('avatarUrl').optional().isString(),
];
export const commentValidation = [
  body('text', 'Текст должен состоять минимум из 1 символа').isLength({ min: 1 }).isString(),
];
