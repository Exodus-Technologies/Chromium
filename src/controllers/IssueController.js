'use strict';

import { IssueService } from '../services';

exports.getIssues = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await IssueService.getIssues(query);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting issues: `, err);
    next(err);
  }
};

exports.getIssueById = async (req, res, next) => {
  try {
    const { issueId } = req.params;
    const [statusCode, response] = await IssueService.getIssueById(issueId);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting an issue: `, err);
    next(err);
  }
};

exports.createIssue = async (req, res, next) => {
  try {
    const payload = await IssueService.getPayloadFromRequest(req);
    const [statusCode, response] = await IssueService.createIssue(payload);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with creating issue: `, err);
    next(err);
  }
};

exports.updateIssue = async (req, res, next) => {
  try {
    const payload = await IssueService.getPayloadFromRequest(req);
    const [statusCode, response] = await IssueService.updateIssue(payload);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with updating issue: `, err);
    next(err);
  }
};

exports.updateViews = async (req, res, next) => {
  try {
    const { issueId } = req.body;
    const [statusCode, payload] = await VideoService.updateViews(issueId);
    res.status(statusCode).send(payload);
  } catch (err) {
    console.log(`Error with updating views for issue: `, err);
    next(err);
  }
};

exports.deleteIssueById = async (req, res, next) => {
  try {
    const { issueId } = req.params;
    const [statusCode, response] = await IssueService.deleteIssueById(issueId);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with deleteing an issue: `, err);
    next(err);
  }
};
