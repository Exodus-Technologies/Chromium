'use strict';

export const badRequest = message => {
  return [400, { error: 'Bad Request', message }];
};

export const unauthorizedRequest = message => {
  return [401, { error: 'Unauthorized Request', message }];
};

export const forbiddenRequest = message => {
  return [403, { error: 'Forbidden Request', message }];
};

export const notFoundRequest = message => {
  return [404, { error: 'Not Found', message }];
};

export const badImplementationRequest = message => {
  return [500, { error: 'Bad Implementation Request', message }];
};

export const badGatewaynRequest = message => {
  return [502, { error: 'Bad Gateway Request', message }];
};

export const serverUnavailableRequest = message => {
  return [503, { error: 'Server Unavailable Request', message }];
};

export const gatewayTimeoutRequest = message => {
  return [504, { error: 'Gateway Timeout Request', message }];
};
