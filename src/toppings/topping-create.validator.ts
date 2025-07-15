import { body } from 'express-validator';

export default [
  body('name')
    .exists()
    .withMessage('ToppingName is required')
    .isString()
    .withMessage('topping Name must be a string'),
  body('price').exists().withMessage('price is required'),
  body('tenantId').exists().withMessage('tenantId field is required'),
  body('image').custom((value, { req }) => {
    if (!req.files) {
      throw new Error('topping image is not found');
    }
    return true;
  }),
];
