import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { DEFAULT_TIME_FORMAT } from '../constants';

export const getSubscriptionStartDate = () => {
  return moment(new Date()).format(DEFAULT_TIME_FORMAT);
};

export const getSubscriptionEndDate = (date = new Date()) => {
  let year = moment(date).year();
  const month = moment(date).month();
  const day = moment(date).date();
  const momentObj = {
    year: month === 11 && day > 29 && day <= 31 ? (year += 1) : year,
    month: 11,
    date: 30
  };
  return moment(date).utc().set(momentObj).format(DEFAULT_TIME_FORMAT);
};

export const createMoment = (date = new Date()) => {
  return moment(date);
};

export const createFormattedDate = (date = new Date()) => {
  return moment(date).format(DEFAULT_TIME_FORMAT);
};

export const createSubscriptionId = () => {
  return uuidv4();
};

export const fancyTimeFormat = duration => {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
};
