import express from 'express';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { Roles } from '../common/constants';
import toppingCreateValidator from './topping-create.validator';
import { ToppingController } from './topping.controller';
import { ToppingService } from './toppingService';
import { Cloudinary } from '../common/services/cloudinary';
import fileUpload from 'express-fileupload';
import createHttpError from 'http-errors';
import { asyncWrapper } from '../common/utils/wrapper';

const router = express.Router();

const toppingService = new ToppingService();
const cloudinary = new Cloudinary();

const toppingController = new ToppingController(toppingService, cloudinary);

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
  toppingCreateValidator,
  asyncWrapper(toppingController.create),
);
router.put(
  '/:toppingId',
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
  toppingCreateValidator,
  asyncWrapper(toppingController.update),
);

router.delete(
  '/:toppingId',
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  toppingCreateValidator,
  asyncWrapper(toppingController.delete),
);

router.get('/:toppingId', asyncWrapper(toppingController.getOne));

router.get('/', asyncWrapper(toppingController.getAll));

export default router;
