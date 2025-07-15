import { body } from 'express-validator';

export default [
  body('name')
    .exists()
    .withMessage('Product name is required')
    .isString()
    .withMessage('Product name should be a string'),
  body('price').exists().withMessage('Price configuration is required'),
  body('tenantId').exists().withMessage('Tenant id field is required'),
];
