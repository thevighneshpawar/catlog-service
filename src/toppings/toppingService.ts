import mongoose from 'mongoose';
import toppingModel from './topping.model';
import { Filter, PaginateQuery, Topping } from './topping.types';
import { paginationLabels } from '../config/pagination';

export class ToppingService {
  async createTopping(topping: Topping): Promise<Topping> {
    return (await toppingModel.create(topping)) as Topping;
  }

  async updateTopping(toppingId: string, topping: Topping) {
    return (await toppingModel.findOneAndUpdate(
      { _id: toppingId },
      {
        $set: topping,
      },
      {
        new: true,
      },
    )) as Topping;
  }

  async getTopping(toppingId: string): Promise<Topping | null> {
    if (!mongoose.isValidObjectId(toppingId)) {
      return null;
    }

    return await toppingModel.findOne({ _id: toppingId });
  }

  async getToppings(q: string, filters: Filter, paginateQuery: PaginateQuery) {
    const searchQueryRegex = new RegExp(q, 'i'); // small case

    const matchQuery = {
      ...filters,
      name: searchQueryRegex,
    };

    const aggregate = toppingModel.aggregate([
      {
        $match: matchQuery,
      },
    ]);

    return await toppingModel.aggregatePaginate(aggregate, {
      ...paginateQuery,
      customLabels: paginationLabels,
    });
  }

  async deleteTopping(toppingId: string) {
    if (!mongoose.isValidObjectId(toppingId)) {
      return null;
    }

    await toppingModel.findOneAndDelete({ _id: toppingId });
  }
}
