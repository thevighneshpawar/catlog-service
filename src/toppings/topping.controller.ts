import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { Filter, ToppingRequest } from './topping.types';
import { ToppingService } from './toppingService';
import { FileStorage } from '../common/types/storage';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../common/types';
import { Roles } from '../common/constants';
import mongoose from 'mongoose';

export class ToppingController {
  constructor(
    private toppingService: ToppingService,
    private storage: FileStorage,
  ) {}

  create = async (
    req: Request & { body: ToppingRequest },
    res: Response,
    next: NextFunction,
  ) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const image = req.files!.image as UploadedFile;
    const imageName = uuidv4();

    const imageUrl = await this.storage.upload({
      filename: imageName,
      fileData: image.data.buffer,
    });

    const { name, price, tenantId, isPublish } = req.body as ToppingRequest;

    const toppping = {
      name,
      image: imageUrl,
      price,
      tenantId,
      isPublish,
    };

    const newTopping = await this.toppingService.createTopping(toppping);

    res.json({ id: newTopping._id });
  };

  update = async (
    req: Request & { body: Partial<ToppingRequest> },
    res: Response,
    next: NextFunction,
  ) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const { toppingId } = req.params;

    const topping = await this.toppingService.getTopping(toppingId);
    if (!topping) {
      return next(createHttpError(404, 'topping not found'));
    }

    if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
      const tenant = (req as AuthRequest).auth.tenant;
      if (topping.tenantId !== tenant) {
        return next(
          createHttpError(403, 'You are not allowed to access this topping'),
        );
      }
    }

    let imageName: string | undefined;
    let oldImage: string | undefined;
    let imageUrl: string | undefined;

    if (req.files?.image) {
      oldImage = topping.image;

      const image = req.files.image as UploadedFile;
      imageName = uuidv4();

      imageUrl = await this.storage.upload({
        filename: imageName,
        fileData: image.data.buffer,
      });

      const publicId = oldImage ? oldImage.split('/').pop()?.split('.')[0] : '';

      if (publicId) {
        await this.storage.delete(publicId);
      }
    }

    const { name, price, tenantId, isPublish } = req.body as ToppingRequest;

    const toppingToUpdate = {
      name,
      price,

      tenantId,

      isPublish,
      image: imageUrl ? imageUrl : (oldImage as string),
    };

    await this.toppingService.updateTopping(toppingId, toppingToUpdate);

    res.json({ id: toppingId });
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const { toppingId } = req.params;

    const topping = await this.toppingService.getTopping(toppingId);
    if (!topping) {
      return next(createHttpError(404, 'topping not found'));
    }

    if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
      const tenant = (req as AuthRequest).auth.tenant;
      if (topping.tenantId !== tenant) {
        return next(
          createHttpError(403, 'You are not allowed to delete this topping'),
        );
      }
    }

    if (topping.image) {
      const publicId = topping.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        await this.storage.delete(publicId);
      }
    }

    await this.toppingService.deleteTopping(toppingId);

    res.json({ success: true, message: 'topping deleted successfully' });
  };

  getAll = async (req: Request, res: Response) => {
    const { q, tenantId, isPublish } = req.query;

    const filter: Filter = {};

    // if we set them directly so it will go as undefined
    // so we need to check if they are defined

    if (isPublish === 'true') {
      filter.isPublish = true;
    }

    if (tenantId) {
      filter.tenantId = tenantId as string;
    }

    const topping = await this.toppingService.getToppings(q as string, filter, {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    });

    res.json({
      data: topping,
      total: topping.total,
      pageSize: topping.limit,
      currentPage: topping.page,
    });
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { toppingId } = req.params;

    // Optional: Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(toppingId)) {
      return next(createHttpError(400, 'Invalid topping ID format'));
    }

    const topping = await this.toppingService.getTopping(toppingId);
    if (!topping) {
      return next(createHttpError(404, 'topping not found'));
    }

    res.json({ topping });
  };
}
