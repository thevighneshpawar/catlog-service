import { body } from 'express-validator';

export default [
  body('name')
    .exists()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),
  body('priceConfiguration')
    .exists()
    .withMessage('Price configuration is required'),
  body('priceConfiguration.*.priceType')
    .exists()
    .withMessage('Price type is required')
    .custom((value: 'base' | 'aditional') => {
      const validKeys = ['base', 'aditional'];
      if (!validKeys.includes(value)) {
        throw new Error(
          `${value} is invalid attribute for priceType field. Possible values are: [${validKeys.join(
            ', ',
          )}]`,
        );
      }
      return true;
    }),
  body('attributes').exists().withMessage('Attributes field is required'),
];
