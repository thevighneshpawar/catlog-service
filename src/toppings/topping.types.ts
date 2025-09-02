import { Request } from 'express';
import mongoose from 'mongoose';

export interface Topping {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  tenantId: string;
  isPublish: boolean;
}

export interface ToppingRequest extends Request {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image?: string;
  tenantId: string;
  isPublish: boolean;
}

export interface Filter {
  tenantId?: string;
  isPublish?: boolean;
}

export interface PaginateQuery {
  page: number;
  limit: number;
}

export enum ToppingEvents {
  TOPPING_CREATE = 'TOPPING_CREATE',
  TOPPING_UPDATE = 'TOPPING_UPDATE',
  TOPPING_DELETE = 'TOPPING_DELETE',
}
