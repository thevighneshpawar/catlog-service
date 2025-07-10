import { body } from 'express-validator';

export default [
  body('name')
    .exists()
    .withMessage('Product Name is required')
    .isString()
    .withMessage('Product Name must be a string'),
  body('description').exists().withMessage('Description is required'),
  body('priceConfiguration')
    .exists()
    .withMessage('priceConfiguration is required'),
  body('attributes').exists().withMessage('Attributes field is required'),
  body('tenantId').exists().withMessage('tenantId field is required'),
  body('categoryId').exists().withMessage('categoryId field is required'),
  // body('image').custom((value, { req }) => {
  //   if (!req.files) throw new Error('Product image is not found');
  //   return;
  // }),
];
