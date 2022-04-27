import express from 'express';

const { Router } = express;
import { SubscriptionController } from '../controllers';
import {
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionPutBodyValidation
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

router.put(
  '/issue-service/updateSubscription',
  subscriptionPutBodyValidation,
  validationHandler,
  SubscriptionController.updateSubscription
);

//Get remaining time in months and days of subscriptio
// router.get(
//   '/issue-service/getSubscriptionStatus',
//   SubscriptionController.getSubscriptionStatus
// );

export default router;
