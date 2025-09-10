import express, { Request, Response } from 'express';
import { globalErrorHandler } from './common/middlewares/globalErrorHandler';
import CategoryRouter from './category/category.route';
import cookieParser from 'cookie-parser';
import productRouter from './product/product.route';
import toppingRouter from './toppings/topping.route';
import cors from 'cors';
import config from 'config';

const app = express();
const ALLOWED_DOMAINS = [
  config.get('frontend.clientUI'),
  config.get('frontend.adminUI'),
];

app.use(
  cors({
    origin: ALLOWED_DOMAINS as string[],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hello from catalog' });
});

app.use('/categories', CategoryRouter);
app.use('/products', productRouter);
app.use('/toppings', toppingRouter);

// it will handle all sync errors
//to handle async errors we have wrapper in common/utils
app.use(globalErrorHandler);

export default app;
