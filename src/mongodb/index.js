'use strict';

import config from '../config';
import models from '../models';

const { dbUser, dbPass, clusterName, dbName } = config.sources.database;

export const generateDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterName}.ybdno.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

const queryOps = { __v: 0, _id: 0 };

export const getIssues = async query => {
  const { Issue } = models;
  const issues = await Issue.find(query, queryOps);
  return issues;
};

export const getIssueById = async issueId => {
  const { Issue } = models;
  const issue = await Issue.findOne({ issueId });
  return issue;
};

export const getIssueByTitle = async title => {
  const { Issue } = models;
  const issue = await Issue.findOne({ title });
  return issue;
};

export const createIssue = async payload => {
  try {
    const { Issue } = models;
    const issue = new Issue(payload);
    const createdIssue = await issue.save();
    return createdIssue;
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
  const { Issue } = models;
  const deletedIssue = await Issue.deleteOne({ issueId });
  return deletedIssue;
};
