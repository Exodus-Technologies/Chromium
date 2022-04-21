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
    .optional()
];

const subscriptionQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for issues.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for issues.')
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
  issueIdBodyValidation,
  subscriptionQueryValidation
};
