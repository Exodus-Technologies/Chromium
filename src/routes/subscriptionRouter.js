import express from 'express';

const { Router } = express;
import { SubscriptionController } from '../controllers';
import {
  subscriptionQueryValidation,
  subscriptionPostBodyValidation
} from '../validations';
import { validationHandler } from '../middlewares';

const router = Router();

router.get(
  '/issue-service/getSubscriptions',
  subscriptionQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptions
);

router.post(
  '/issue-service/createSubscription',
  subscriptionPostBodyValidation,
  validationHandler,
  SubscriptionController.createSubscription
);

//Update endDate based on current year
// router.put(
//   '/issue-service/updateSubscription',
//   SubscriptionController.updateSubscription
// );

//Get remaining time in months and days of subscriptio
// router.get(
//   '/issue-service/getSubscriptionStatus',
//   SubscriptionController.getSubscriptionStatus
// );

export default router;
