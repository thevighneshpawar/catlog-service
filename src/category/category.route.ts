import express from 'express';
import { CategoryController } from './category.controller';
import categoryValidator from './categoryValidator';
import { CategoryService } from './categoryService';
import logger from '../config/logger';
import { asyncWrapper } from '../common/utils/wrapper';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { Roles } from '../common/constants';

const router = express.Router();

const categoryservice = new CategoryService();

const categoryController = new CategoryController(categoryservice, logger);

router.post(
  '/',
  authenticate,
  canAccess([Roles.ADMIN]),
  categoryValidator,
  asyncWrapper(categoryController.create),
);

export default router;
