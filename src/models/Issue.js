'use strict';

import mongoose from 'mongoose';
import config from '../config';
import { createIssueId } from '../utilities';

const { Schema } = mongoose;
const { NODE_ENV } = config;

//ISSUE SCHEMA
//  ============================================
const issueSchema = new Schema(
  {
    issueId: { type: String, default: createIssueId() },
    title: { type: String, required: true },
    url: { type: String, required: true },
    totalViews: { type: Number, default: 0 },
    key: { type: String, required: true },
    availableForSale: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
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
 * Create Issue model out of issueSchema
 */
const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
