import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { ProductService } from './productService';
import { ProductRequest } from './product.types';

export class ProductController {
  constructor(private productService: ProductService) {}

  create = async (
    req: Request & { body: ProductRequest },
    res: Response,
    next: NextFunction,
  ) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
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
