'use strict';

import mongoose from 'mongoose';
import config from '../config';
import mongooseSequence from 'mongoose-sequence';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);
const { NODE_ENV } = config;

//ISSU$ SCHEMA
//  ============================================
const issueSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
    totalViews: { type: Number, default: 0 },
    author: { type: String, required: true },
    paid: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
issueSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Increments issueId everytime an instances is created
 */
issueSchema.plugin(autoIncrement, { inc_field: 'issueId' });

/**
 * Create Issue model out of issueSchema
 */
const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
