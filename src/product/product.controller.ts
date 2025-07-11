import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { ProductService } from './productService';
import { ProductRequest } from './product.types';
import { FileStorage } from '../common/types/storage';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';

export class ProductController {
  constructor(
    private productService: ProductService,
    private storage: FileStorage,
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

    await this.storage.upload({
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
      image: 'image.jpg',
    };

    const newProduct = await this.productService.createProduct(product);

    res.json({ id: newProduct._id });
  };
}
