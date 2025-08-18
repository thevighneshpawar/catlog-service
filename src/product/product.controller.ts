import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { ProductService } from './productService';
import { Filter, ProductRequest } from './product.types';
import { FileStorage } from '../common/types/storage';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';
import { AuthRequest } from '../common/types';
import { Roles } from '../common/constants';
import mongoose from 'mongoose';
import config from 'config';

import { MessageProducerBroker } from '../common/types/broker';
import { mapToObject } from '../utils';

export class ProductController {
  constructor(
    private productService: ProductService,
    private storage: FileStorage,
    private broker: MessageProducerBroker,
  ) {}

  create = async (
    req: Request & { body: ProductRequest },
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

    const {
      name,
      description,
      priceConfiguration,
      attributes,
      tenantId,
      categoryId,
      isPublish,
    } = req.body as ProductRequest;

    const product = {
      name,
      description,
      priceConfiguration: JSON.parse(priceConfiguration) as string,
      attributes: JSON.parse(attributes) as string,
      tenantId,
      categoryId,
      isPublish,
      image: imageUrl,
    };

    const newProduct = await this.productService.createProduct(product);

    //send kafka to kafka

    await this.broker.sendMessage(
      config.get('kafka.topic'),
      JSON.stringify({
        id: newProduct._id,
        // todo: fix the typescript error
        priceConfiguration: mapToObject(
          newProduct.priceConfiguration as unknown as Map<unknown, unknown>,
        ),
      }),
    );
    res.json({ id: newProduct._id });
  };

  update = async (
    req: Request & { body: Partial<ProductRequest> },
    res: Response,
    next: NextFunction,
  ) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const { productId } = req.params;

    const product = await this.productService.getProduct(productId);
    if (!product) {
      return next(createHttpError(404, 'Product not found'));
    }

    if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
      const tenant = (req as AuthRequest).auth.tenant;
      if (product.tenantId !== tenant) {
        return next(
          createHttpError(403, 'You are not allowed to access this product'),
        );
      }
    }

    let imageName: string | undefined;
    let oldImage: string | undefined;
    let imageUrl: string | undefined;

    if (req.files?.image) {
      oldImage = product.image;

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

    const {
      name,
      description,
      priceConfiguration,
      attributes,
      tenantId,
      categoryId,
      isPublish,
    } = req.body as ProductRequest;

    const productToUpdate = {
      name,
      description,
      priceConfiguration: JSON.parse(priceConfiguration) as string,
      attributes: JSON.parse(attributes) as string,
      tenantId,
      categoryId,
      isPublish,
      image: imageUrl ? imageUrl : (oldImage as string),
    };

    const newProduct = await this.productService.updateProduct(
      productId,
      productToUpdate,
    );

    await this.broker.sendMessage(
      config.get('kafka.topic'),
      JSON.stringify({
        id: newProduct._id,
        // todo: fix the typescript error
        priceConfiguration: mapToObject(
          newProduct.priceConfiguration as unknown as Map<unknown, unknown>,
        ),
      }),
    );

    res.json({ id: productId });
  };

  index = async (req: Request, res: Response) => {
    const { q, tenantId, categoryId, isPublish } = req.query;

    const filter: Filter = {};

    // if we set them directly so it will go as undefined
    // so we need to check if they are defined

    if (isPublish === 'true') {
      filter.isPublish = true;
    }

    if (tenantId) {
      filter.tenantId = tenantId as string;
    }

    if (categoryId && mongoose.isValidObjectId(categoryId)) {
      filter.categoryId = new mongoose.Types.ObjectId(categoryId as string);
    }

    const products = await this.productService.getProducts(
      q as string,
      filter,
      {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      },
    );

    res.json({
      data: products,
      total: products.total,
      pageSize: products.limit,
      currentPage: products.page,
    });
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    const product = await this.productService.getProduct(productId);
    if (!product) {
      return next(createHttpError(404, 'Product not found'));
    }

    if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
      const tenant = (req as AuthRequest).auth.tenant;
      if (product.tenantId !== tenant) {
        return next(
          createHttpError(403, 'You are not allowed to delete this product'),
        );
      }
    }

    if (product.image) {
      const publicId = product.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        await this.storage.delete(publicId);
      }
    }

    await this.productService.deleteProduct(productId);

    res.json({ success: true, message: 'Product deleted successfully' });
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    // Optional: Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(createHttpError(400, 'Invalid product ID format'));
    }

    const product = await this.productService.getProduct(productId);
    if (!product) {
      return next(createHttpError(404, 'Product not found'));
    }

    res.json({ product });
  };
}
