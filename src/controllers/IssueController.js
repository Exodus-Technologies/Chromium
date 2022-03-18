'use strict';

import { IssueService } from '../services';

exports.getIssues = async (req, res, next) => {
  try {
    const { query } = req;
    const response = await IssueService.getIssues(query);
    res.status(response.statusCode).send(response);
  } catch (err) {
    console.log(`Error with uploading files to s3: `, err);
    next(err);
  }
};
