import express from 'express';
import { CategoryController } from './category.controller';
import categoryValidator from './categoryValidator';
import { CategoryService } from './categoryService';
import logger from '../config/logger';
import { asyncWrapper } from '../common/utils/wrapper';

const router = express.Router();

const categoryservice = new CategoryService();

const categoryController = new CategoryController(categoryservice, logger);

router.post(
  '/category',
  categoryValidator,
  asyncWrapper(categoryController.create),
);

export default router;
