'use strict';

import mongoose from 'mongoose';
import config from '../config';
import { DEFAULT_SUBSCRIPTION_TYPE } from '../constants';
import { createSubscriptionId } from '../utilities';

const { Schema } = mongoose;
const { NODE_ENV } = config;

//ISSUE SCHEMA
//  ============================================
const subscriptionSchema = new Schema({
  startDate: { type: String },
  endDate: { type: String },
  type: { type: String, default: DEFAULT_SUBSCRIPTION_TYPE },
  purchaseDate: { type: String },
  amount: { type: Number, default: 15 },
  userId: { type: Number, required: true },
  subscriptionId: { type: String, default: createSubscriptionId() }
});

/**
 * Set the autoCreate option on models if not on production
 */
subscriptionSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Create Subscription model out of subscriptionSchema
 */
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
