'use strict';

import express from 'express';

const { Router } = express;
import { IssueController } from '../controllers';
import {
  issueQueryValidation,
  issueIdParamValidation,
  issueIdBodyValidation
} from '../validations';
import { validationHandler } from '../middlewares';

const router = Router();

router.get(
  '/issue-service/getIssues',
  issueQueryValidation,
  validationHandler,
  IssueController.getIssues
);

router.get('/issue-service/getTotal', IssueController.getTotal);

router.get(
  '/issue-service/getIssue/:issueId',
  issueIdParamValidation,
  validationHandler,
  IssueController.getIssueById
);

router.post('/issue-service/createIssue', IssueController.createIssue);

router.put('/issue-service/updateIssue', IssueController.updateIssue);

router.put(
  '/issue-service/updateViews',
  issueIdBodyValidation,
  validationHandler,
  IssueController.updateViews
);

router.delete(
  '/issue-service/deleteIssue/:issueId',
  issueIdParamValidation,
  validationHandler,
  IssueController.deleteIssueById
);

export default router;
