'use strict';

import config from '../config';
import models from '../models';
import { DEFAULT_SUBSCRIPTION_TYPE } from '../constants';
import { createMoment } from '../utilities';

const { dbUser, dbPass, clusterName, dbName } = config.sources.database;

export const generateDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterName}.ybdno.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

const queryOps = { __v: 0, _id: 0 };

export const getIssues = async query => {
  try {
    const { Issue, Subscription } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const userId = parseInt(query.userId);
    const skipIndex = (page - 1) * limit;
    const subscriptions = userId
      ? await Subscription.find({ userId, type: DEFAULT_SUBSCRIPTION_TYPE })
          .sort({
            endDate: 'desc'
          })
          .limit(1)
      : null;
    const issues = await Issue.find(query, queryOps)
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .sort({ createdAt: 'desc' })
      .lean()
      .exec();
    return issues.map(issue => ({
      ...issue,
      paid:
        subscriptions && subscriptions.length
          ? createMoment(issue.createdAt).isBefore(
              createMoment(subscriptions[0].endDate)
            )
          : false
    }));
  } catch (err) {
    console.log('Error getting issue data from db: ', err);
  }
};

export const getIssueById = async issueId => {
  try {
    const { Issue } = models;
    const issue = await Issue.findOne({ issueId });
    return issue;
  } catch (err) {
    console.log('Error getting issue data from db by id: ', err);
  }
};

export const getIssueByTitle = async title => {
  try {
    const { Issue } = models;
    const issue = await Issue.findOne({ title });
    return issue;
  } catch (err) {
    console.log('Error getting issue data from db by title: ', err);
  }
};

export const createIssue = async payload => {
  try {
    const { Issue } = models;
    const issue = new Issue(payload);
    const createdIssue = await issue.save();
    const { title, url, description, totalViews, author, issueId } =
      createdIssue;
    return {
      title,
      url,
      description,
      totalViews,
      author,
      issueId
    };
  } catch (err) {
    console.log('Error saving issue data to db: ', err);
  }
};

export const updateIssue = async payload => {
  try {
    const { Issue } = models;
    const { issueId } = payload;
    const filter = { issueId };
    const options = { upsert: true };
    const update = { ...payload };

    await Issue.findOneAndUpdate(filter, update, options);
  } catch (err) {
    console.log('Error updating issue data to db: ', err);
  }
};

export const deleteIssueById = async issueId => {
  try {
    const { Issue } = models;
    const deletedIssue = await Issue.deleteOne({ issueId });
    return deletedIssue;
  } catch (err) {
    console.log('Error deleting issue data from db: ', err);
  }
};
