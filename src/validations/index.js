'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, query, validationResult } from 'express-validator';

const issueQueryValidation = [
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for issues')
    .optional()
    .default(30),
  query('title')
    .isString()
    .withMessage('Must provide a existing issue title')
    .optional(),
  query('author')
    .isString()
    .withMessage('Must provide a valid issue author')
    .optional(),
  body('paid')
    .isBoolean()
    .withMessage('Must provide a valid status for paid vs free issues')
    .optional()
];

export { validationResult, issueQueryValidation };
