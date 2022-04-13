'use strict';

export const badRequest = message => {
  return [
    400,
    {
      errors: [
        {
          value: 'Bad Request',
          msg: message
        }
      ]
    }
  ];
};

export const unauthorizedRequest = message => {
  return [
    401,
    {
      errors: [
        {
          value: 'Unauthorized Request',
          msg: message
        }
      ]
    }
  ];
};

export const forbiddenRequest = message => {
  return [
    403,
    {
      errors: [
        {
          value: 'Forbidden Request',
          msg: message
        }
      ]
    }
  ];
};

export const notFoundRequest = message => {
  return [
    404,
    {
      errors: [
        {
          value: 'Not Found',
          msg: message
        }
      ]
    }
  ];
};

export const badImplementationRequest = message => {
  return [
    500,
    {
      errors: [
        {
          value: 'Bad Implementation Request',
          msg: message
        }
      ]
    }
  ];
};

export const badGatewaynRequest = message => {
  return [
    502,
    {
      errors: [
        {
          value: 'Bad Gateway Request',
          msg: message
        }
      ]
    }
  ];
};

export const serverUnavailableRequest = message => {
  return [
    503,
    {
      errors: [
        {
          value: 'Server Unavailable Request',
          msg: message
        }
      ]
    }
  ];
};

export const gatewayTimeoutRequest = message => {
  return [
    504,
    {
      errors: [
        {
          value: 'Gateway Timeout Request',
          msg: message
        }
      ]
    }
  ];
};
