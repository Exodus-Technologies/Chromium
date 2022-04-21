import express from 'express';

const { Router } = express;
import { SubscriptionController } from '../controllers';
import { subscriptionQueryValidation } from '../validations';
import { validationHandler } from '../middlewares';

const router = Router();

//Get subscriptions
router.get(
  '/issue-service/getSubscriptions',
  subscriptionQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptions
);

//Create subscriptions
//December 30 is the cut off year
// router.post(
//   '/issue-service/createSubscription',
//   SubscriptionController.createSubscription
// );

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
