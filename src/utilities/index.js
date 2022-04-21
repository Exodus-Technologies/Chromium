import moment from 'moment';

import { DEFAULT_TIME_FORMAT } from '../constants';

export const getSubscriptionStartDate = () => {
  return moment(new Date()).format(DEFAULT_TIME_FORMAT);
};

export const getSubscriptionEndDate = () => {
  const year = moment().year();
  const month = moment().month();
  const day = moment().date();
  const momentObj = {
    year: month === 11 && (day > 29 || day <= 31) ? (year += 1) : year,
    month: 11,
    date: 30
  };
  return moment().utc().set(momentObj).format(DEFAULT_TIME_FORMAT);
};
