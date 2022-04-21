'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import config from '../config';
import { DEFAULT_SUBSCRIPTION_TYPE } from '../constants';
import { getSubscriptionEndDate, getSubscriptionStartDate } from '../utilities';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);
const { NODE_ENV } = config;

const startDate = getSubscriptionStartDate();
const endDate = getSubscriptionEndDate();

console.log(endDate);
//ISSUE SCHEMA
//  ============================================
const subscriptionSchema = new Schema({
  startDate: { type: String, default: startDate },
  endDate: { type: String, default: endDate },
  type: { type: String, default: DEFAULT_SUBSCRIPTION_TYPE },
  purchaseDate: { type: String, required: true },
  amount: { type: Number, required: true },
  userId: { type: Number, required: true }
});

/**
 * Set the autoCreate option on models if not on production
 */
subscriptionSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Increments subscriptionId everytime an instances is created
 */
subscriptionSchema.plugin(autoIncrement, { inc_field: 'subscriptionId' });

/**
 * Create Subscription model out of subscriptionSchema
 */
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
