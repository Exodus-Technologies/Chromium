'use strict';

import { SubscriptionService } from '../services';

exports.getSubscriptions = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await SubscriptionService.getSubscriptions(
      query
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting subscriptions: `, err);
    next(err);
  }
};
