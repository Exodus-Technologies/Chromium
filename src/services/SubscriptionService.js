import { getSubscriptions } from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

exports.getSubscriptions = async query => {
  try {
    const subscriptions = await getSubscriptions(query);
    if (subscriptions) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with query params.',
          subscriptions
        }
      ];
    }
    return badRequest(`No subscriptions found with selected query params.`);
  } catch (err) {
    console.log('Error getting all subscriptions: ', err);
    return badImplementationRequest('Error getting subscriptions.');
  }
};
