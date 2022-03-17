'use strict';

export const badRequest = message => {
  return {
    statusCode: 400,
    error: 'Bad Request',
    message
  };
};

export const unauthorizedRequest = message => {
  return {
    statusCode: 401,
    error: 'Unauthorized Request',
    message
  };
};

export const forbiddenRequest = message => {
  return {
    statusCode: 403,
    error: 'Forbidden Request',
    message
  };
};

export const notFoundRequest = message => {
  return {
    statusCode: 404,
    error: 'Not Found',
    message
  };
};

export const badImplementationRequest = message => {
  return {
    statusCode: 500,
    error: 'Bad Implementation Request',
    message
  };
};

export const badGatewaynRequest = message => {
  return {
    statusCode: 502,
    error: 'Bad Gateway Request',
    message
  };
};

export const serverUnavailableRequest = message => {
  return {
    statusCode: 503,
    error: 'Server Unavailable Request',
    message
  };
};

export const gatewayTimeoutRequest = message => {
  return {
    statusCode: 503,
    error: 'Gateway Timeout Request',
    message
  };
};
