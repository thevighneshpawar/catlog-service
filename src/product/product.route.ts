import express from 'express';
import { asyncWrapper } from '../common/utils/wrapper';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { Roles } from '../common/constants';
import { ProductController } from './product.controller';
import productValidator from './product.validator';
import { ProductService } from './productService';
import fileUpload from 'express-fileupload';
import { Cloudinary } from '../common/services/cloudinary';
import createHttpError from 'http-errors';

const router = express.Router();

const productService = new ProductService();
const cloudinary = new Cloudinary();

const productController = new ProductController(productService, cloudinary);

router.post(
  '/',
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
      const error = createHttpError(
        413,
        'File size limit exceeded. Maximum allowed size is 10 MB.',
      );
      next(error);
    },
  }),
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
