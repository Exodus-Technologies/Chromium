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
  query('userId')
    .isString()
    .withMessage('Must provide a valid userId.')
    .optional()
];

const issueIdParamValidation = [
  param('issueId').isString().withMessage('Must provide an id for a issue.')
];

const issueIdBodyValidation = [
  body('issueId').isString().withMessage('Must provide an existing issue id.')
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

const subscriptionPostBodyValidation = [
  body('userId').isNumeric().withMessage('Must provide a valid userId.')
];

const subscriptionStatusQueryValidation = [
  query('userId').isString().withMessage('Must provide a valid userId.')
];

const subscriptionPutBodyValidation = [
  body('startDate')
    .isString()
    .withMessage('Must provide a valid startDate for subscription.'),
  body('userId').isNumeric().withMessage('Must provide a valid userId.')
];

export {
  validationResult,
  issueQueryValidation,
  issueIdParamValidation,
  issueIdBodyValidation,
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionPutBodyValidation,
  subscriptionStatusQueryValidation
};
