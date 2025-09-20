import { Filter, PaginateQuery, Product } from './product.types';
import productModel from './product.model';
import { paginationLabels } from '../Config/pagination';
import mongoose from 'mongoose';

export class ProductService {
  async createProduct(product: Product) {
    return (await productModel.create(product)) as Product;
  }

  async updateProduct(productId: string, product: Product) {
    return (await productModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: product,
      },
      {
        new: true,
      },
    )) as Product;
  }

  async getProduct(productId: string): Promise<Product | null> {
    if (!mongoose.isValidObjectId(productId)) {
      return null;
    }

    return await productModel.findOne({ _id: productId });
  }

  async getProducts(q: string, filters: Filter, paginateQuery: PaginateQuery) {
    const searchQueryRegex = new RegExp(q, 'i'); // small case

    const matchQuery = {
      ...filters,
      name: searchQueryRegex,
    };

    const aggregate = productModel.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                priceConfiguration: 1,
                attributes: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: '$category',
      },
    ]);

    return await productModel.aggregatePaginate(aggregate, {
      ...paginateQuery,
      customLabels: paginationLabels,
    });

    // const result = aggregate.exec();

    // return result as unknown as Product[];
  }

  async deleteProduct(productId: string) {
    if (!mongoose.isValidObjectId(productId)) {
      return null;
    }

    await productModel.findOneAndDelete({ _id: productId });
  }
}
