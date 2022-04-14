'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { query, body, param, validationResult } from 'express-validator';

const issueQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for issues.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for issues.'),
  query('title')
    .isString()
    .withMessage('Must provide a existing issue title.')
    .optional(),
  query('author')
    .isString()
    .withMessage('Must provide a valid issue author.')
    .optional(),
  query('price')
    .isString()
    .withMessage('Must provide a price for issue.')
    .optional(),
  query('magazineId')
    .isString()
    .withMessage('Must provide a magazineId for associated issue.')
    .optional(),
  query('paid')
    .isBoolean()
    .withMessage('Must provide a valid status for paid vs free issues.')
    .optional()
];

const issueIdParamValidation = [
  param('issueId').isString().withMessage('Must provide an id for a issue.')
];

const issueIdBodyValidation = [
  body('issueId').isString().withMessage('Must provide a existing issue id.')
];

export {
  validationResult,
  issueQueryValidation,
  issueIdParamValidation,
  issueIdBodyValidation
};
