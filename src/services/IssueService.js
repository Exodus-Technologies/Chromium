'use strict';

import formidable from 'formidable';
import {
  uploadArchiveToS3Location,
  doesS3BucketExist,
  createS3Bucket,
  doesS3ObjectExist,
  deleteIssueByKey
} from '../aws';
import {
  saveIssueRefToDB,
  updateIssueViews,
  getIssueById,
  getIssueByTitle,
  updateIssue,
  getIssues
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

const form = formidable({ multiples: true });

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function doesValueHaveSpaces(str) {
  return !/\s/.test(str);
}

exports.getPayloadFromRequest = async req => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      const { title, author, issueId, paid } = fields;
      if (!isEmpty(files)) {
        const { filepath } = files['file'];
        resolve({ filepath, title, author, issueId, paid });
      } else {
        resolve({ title, author, issueId, paid });
      }
    });
  });
};

exports.uploadIssue = async archive => {
  try {
    const { title, author } = archive;
    if (doesValueHaveSpaces(title)) {
      return badRequest('Title of issue must not have spaces.');
    }
    const issue = await getIssueByTitle(title);
    if (issue) {
      return badRequest(
        `Issue with the title ${title} provide already exists.`
      );
    } else {
      const isBucketAvaiable = await doesS3BucketExist();
      if (isBucketAvaiable) {
        const s3Location = await uploadArchiveToS3Location(archive);
        const body = {
          title,
          author,
          url: s3Location
        };
        const savedIssue = await saveIssueRefToDB(body);
        return {
          statusCode: 200,
          message: 'Issue uploaded to s3 with success',
          issue: savedIssue
        };
      } else {
        await createS3Bucket();
        const isBucketAvaiable = await doesS3BucketExist();
        if (isBucketAvaiable) {
          const s3Location = await uploadArchiveToS3Location(archive);
          const body = {
            title,
            author,
            url: s3Location
          };
          const savedIssue = await saveIssueRefToDB(body);
          return {
            statusCode: 200,
            message: 'Issue uploaded to s3 with success',
            issue: savedIssue
          };
        } else {
          return badRequest('Unable to create s3 bucket.');
        }
      }
    }
  } catch (err) {
    console.log(`Error uploading issue to s3: `, err);
    return badImplementationRequest('Error uploading issue to s3.');
  }
};

exports.getIssues = async query => {
  try {
    const issues = await getIssues(query);
    if (issues.length) {
      return {
        statusCode: 200,
        items: issues
      };
    } else {
      return badRequest(`No issues found with selected query params.`);
    }
  } catch (err) {
    console.log('Error getting all issues: ', err);
    return badImplementationRequest('Error getting issues.');
  }
};

exports.getIssue = async issueId => {
  try {
    const issue = await getIssueById(issueId);
    if (issue) {
      return {
        statusCode: 200,
        issue
      };
    } else {
      return badRequest(`No issue found with id provided.`);
    }
  } catch (err) {
    console.log('Error getting issue by id ', err);
    return badImplementationRequest('Error getting issue by id.');
  }
};

exports.updateViews = async issueId => {
  try {
    const issueViews = await updateIssueViews(issueId);
    if (issueViews) {
      return {
        statusCode: 200,
        message: `${issueId} has ${issueViews} views.`,
        views: issueViews
      };
    }
    return badRequest(`No issues found to update clicks.`);
  } catch (err) {
    console.log('Error updating views on issue: ', err);
    return badImplementationRequest('Error updating views.');
  }
};

exports.updateIssue = async archive => {
  try {
    const { title, filepath, issueId } = archive;
    if (doesValueHaveSpaces(title)) {
      return badRequest('Title of issue must not have spaces.');
    }
    const issue = await getIssueById(issueId);
    if (issue) {
      if (filepath) {
        const isBucketAvaiable = await doesS3BucketExist();
        if (isBucketAvaiable) {
          const s3Object = await doesS3ObjectExist(title);
          if (s3Object) {
            await deleteIssueByKey(title);
          }
          const s3Location = await uploadArchiveToS3Location(archive);
          const body = {
            ...archive,
            url: s3Location
          };
          await updateIssue(body);
          return {
            statusCode: 200,
            message: 'Issue uploaded to s3 with success',
            issue: {
              ...archive,
              url: s3Location
            }
          };
        }
      } else {
        const body = {
          ...archive
        };
        await updateIssue(body);
        return {
          statusCode: 200,
          message: 'Issue updated with success.',
          issue: {
            ...archive
          }
        };
      }
    } else {
      return badRequest(`No issueId was passed to update issue.`);
    }
  } catch (err) {
    console.log(`Error updating issue metadata: `, err);
    return badImplementationRequest('Error updating issue metadata.');
  }
};
