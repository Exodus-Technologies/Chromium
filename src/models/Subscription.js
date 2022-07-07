'use strict';

import mongoose from 'mongoose';
import config from '../config';

const { Schema } = mongoose;
const { NODE_ENV } = config;

//ISSUE SCHEMA
//  ============================================
const subscriptionSchema = new Schema({
  startDate: { type: String },
  endDate: { type: String },
  type: { type: String },
  purchaseDate: { type: String },
  amount: { type: Number, default: 15 },
  userId: { type: Number, required: true },
  subscriptionId: { type: String }
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
