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
import updateProductValidator from './update-product.validator';
import { createMessageProducerBroker } from '../common/factories/brokerFactory';

const router = express.Router();

const productService = new ProductService();
const cloudinary = new Cloudinary();
const broker = createMessageProducerBroker();

const productController = new ProductController(
  productService,
  cloudinary,
  broker,
);

router.post(
  '/',
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: { fileSize: 500 * 1024 }, // 0.5 MB limit
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

router.put(
  '/:productId',
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: { fileSize: 500 * 1024 }, // 500kb
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
      const error = createHttpError(400, 'File size exceeds the limit');
      next(error);
    },
  }),
  updateProductValidator,
  asyncWrapper(productController.update),
);

router.delete(
  '/:productId',
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(productController.delete),
);

router.get('/', asyncWrapper(productController.index));

router.get('/:productId', asyncWrapper(productController.getOne));

export default router;
