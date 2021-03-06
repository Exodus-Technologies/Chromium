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
    totalViews: { type: Number, default: 0 },
    key: { type: String, required: true },
    avaiableForSale: { type: Boolean, default: false },
    coverImage: { type: String },
    categories: { type: [String], required: true }
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
