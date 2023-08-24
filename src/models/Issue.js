'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import config from '../config';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);
const { NODE_ENV } = config;

//ISSUE SCHEMA
//  ============================================
const issueSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
    totalViews: { type: Number, default: 0 },
    key: { type: String, required: true },
    paid: { type: Boolean, default: true },
    price: { type: Number, default: 5.99 },
    coverImage: { type: String }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
issueSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Increments videoId everytime an instances is created
 */
issueSchema.plugin(autoIncrement, { inc_field: 'issueId' });

/**
 * Create Issue model out of issueSchema
 */
const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
