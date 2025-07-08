import express, { Request, Response } from 'express';
import { globalErrorHandler } from './common/middlewares/globalErrorHandler';
import CategoryRouter from './category/category.route';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hello from catalog' });
});

app.use('/categories', CategoryRouter);

// it will handle all sync errors
//to handle async errors we have wrapper in common/utils
app.use(globalErrorHandler);

export default app;
