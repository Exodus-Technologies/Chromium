'use strict';

import express from 'express';

const { Router } = express;
import { IssueController } from '../controllers';
import { issueQueryValidation } from '../validations';
import { validationHandler } from '../utils';

const router = Router();

router.get(
  '/issue-service/getIssues',
  issueQueryValidation,
  validationHandler,
  IssueController.getIssues
);

router.get('/issue-service/getIssue/:issueId', (_, res) => {
  res.json({
    statusCode: 200,
    message: 'Chromium Issue Manager service up and running!'
  });
});

router.post('/issue-service/createIssue', (_, res) => {
  res.json({
    statusCode: 200,
    message: 'Chromium Issue Manager service up and running!'
  });
});

router.put('/issue-service/updateIssue/:issueId', (_, res) => {
  res.json({
    statusCode: 200,
    message: 'Chromium Issue Manager service up and running!'
  });
});

router.delete('/issue-service/deleteIssue/:issueId', (_, res) => {
  res.json({
    statusCode: 200,
    message: 'Chromium Issue Manager service up and running!'
  });
});

export default router;
