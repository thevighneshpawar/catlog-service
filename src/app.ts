import express, { Request, Response } from 'express';
import { globalErrorHandler } from './common/middlewares/globalErrorHandler';
import CategoryRouter from './category/category.route';
const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hello from catalog' });
});

app.use('/categories', CategoryRouter);

app.use(globalErrorHandler);

export default app;
