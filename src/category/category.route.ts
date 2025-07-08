import express from 'express';
import { CategoryController } from './category.controller';
import categoryValidator from './categoryValidator';
import { CategoryService } from './categoryService';
import logger from '../config/logger';

const router = express.Router();
const categoryservice = new CategoryService();

const categoryController = new CategoryController(categoryservice, logger);

router.post('/category', categoryValidator, categoryController.create);

export default router;
