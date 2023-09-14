'use strict';

import config from '../config';
import models from '../models';

const { dbUser, dbPass, clusterDomain, dbName } = config.sources.database;

export const generateDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterDomain}/${dbName}?retryWrites=true&w=majority`;
};

const queryOps = { __v: 0, _id: 0 };

export const getIssues = async query => {
  try {
    const { Issue } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;

    const filter = [];
    for (const [key, value] of Object.entries(query)) {
      if (key != 'page' && key != 'limit' && key != 'sort') {
        filter.push({ [key]: { $regex: value, $options: 'i' } });
      }
    }

    let objectFilter = {};
    if (filter.length > 0) {
      objectFilter = {
        $and: filter
      };
    }

    const issues = await Issue.find(objectFilter, queryOps)
      .limit(limit)
      .skip(skipIndex)
      .sort({ issueOrder: 'asc' })
      .lean()
      .exec();

    const total = await Issue.find(objectFilter, queryOps).count();
    return issues.map(issue => ({
      ...issue,
      total,
      pages: Math.ceil(total / limit)
    }));
  } catch (err) {
    console.log('Error getting issue data from db: ', err);
  }
};

export const getTotal = async () => {
  try {
    const { Issue } = models;
    const total = await Issue.count();
    return total;
  } catch (err) {
    console.log('Error getting total issue data from db: ', err);
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

export const getNextIssueOrder = async () => {
  try {
    const { Issue } = models;
    const issue = await Issue.find({}).sort({ issueOrder: -1 }).limit(1);
    return (issue[0].issueOrder += 1);
  } catch (err) {
    console.log('Error computing max issue order data from db: ', err);
    return null;
  }
};
