import express from 'express';
import { asyncWrapper } from '../common/utils/wrapper';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { Roles } from '../common/constants';
import { ProductController } from './product.controller';
import productValidator from './product.validator';
import { ProductService } from './productService';
import fileUpload from 'express-fileupload';

const router = express.Router();

const productService = new ProductService();

const productController = new ProductController(productService);

router.post(
  '/',
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload(),
  productValidator,
  asyncWrapper(productController.create),
);

// router.patch(
//   '/:id',
//   authenticate,
//   canAccess([Roles.ADMIN]),
//   categoryUpdateValidator,
//   asyncWrapper(categoryController.update),
// );

// router.delete(
//   '/:id',
//   authenticate,
//   canAccess([Roles.ADMIN]),
//   asyncWrapper(categoryController.destroy),
// );

// router.get('/', asyncWrapper(categoryController.index));

// router.get('/:categoryId', asyncWrapper(categoryController.getOne));

export default router;
