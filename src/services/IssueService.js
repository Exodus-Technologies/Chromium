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
  createIssue,
  updateIssueViews,
  getIssueById,
  deleteIssueById,
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
  return /\s/.test(str);
}

exports.getPayloadFromRequest = async req => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      const { title, author, issueId, paid, description } = fields;
      if (!isEmpty(files)) {
        const { filepath } = files['file'];
        resolve({ filepath, title, author, issueId, paid, description });
      } else {
        resolve({ title, author, issueId, paid, description });
      }
    });
  });
};

exports.getIssues = async query => {
  try {
    const issues = await getIssues(query);
    if (issues) {
      return [
        200,
        {
          message: 'Successful fetch for issue with query params.',
          items: issues
        }
      ];
    }
    return badRequest(`No issues found with selected query params.`);
  } catch (err) {
    console.log('Error getting all issues: ', err);
    return badImplementationRequest('Error getting issues.');
  }
};

exports.getIssueById = async issueId => {
  try {
    const issue = await getIssueById(issueId);
    if (issue) {
      return [
        200,
        { message: `Successful fetch for issue ${issueId}.`, issue }
      ];
    }
    return badRequest(`No issue found with id provided.`);
  } catch (err) {
    console.log('Error getting issue by id ', err);
    return badImplementationRequest('Error getting issue by id.');
  }
};

exports.createIssue = async archive => {
  try {
    const { title, author, description, filepath } = archive;
    if (!filepath) {
      return badRequest('File must be provided to upload.');
    }
    if (doesValueHaveSpaces(title)) {
      return badRequest('Title of issue must not have spaces.');
    }
    if (description && description.length > 255) {
      return badRequest(
        'Description must be provided and less than 255 characters long.'
      );
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
          description,
          url: s3Location
        };
        const savedIssue = await createIssue(body);
        return [
          200,
          { message: 'Issue uploaded to s3 with success', issue: savedIssue }
        ];
      } else {
        await createS3Bucket();
        const isBucketAvaiable = await doesS3BucketExist();
        if (isBucketAvaiable) {
          const s3Location = await uploadArchiveToS3Location(archive);
          const body = {
            title,
            author,
            description,
            url: s3Location
          };
          const savedIssue = await createIssue(body);
          return [
            200,
            { message: 'Issue uploaded to s3 with success', issue: savedIssue }
          ];
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

exports.updateIssue = async archive => {
  try {
    const { title, filepath, issueId, description, author } = archive;
    if (doesValueHaveSpaces(title)) {
      return badRequest('Title of issue must not have spaces.');
    }
    if (description && description.length > 255) {
      return badRequest(
        'Description must be provided and less than 255 characters long.'
      );
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
            title,
            issueId,
            description,
            author,
            url: s3Location
          };
          await updateIssue(body);
          return [
            200,
            {
              message: 'Issue uploaded to s3 with success',
              issue: {
                title,
                issueId,
                description,
                author,
                url: s3Location
              }
            }
          ];
        }
      } else {
        const url = await getObjectUrlFromS3(title);
        const body = {
          title,
          issueId,
          description,
          author,
          url
        };
        await updateIssue(body);
        return [
          200,
          {
            message: 'Issue updated with success.',
            issue: {
              title,
              issueId,
              description,
              author,
              url
            }
          }
        ];
      }
    } else {
      return badRequest(`No issue was found for issueId passed.`);
    }
  } catch (err) {
    console.log(`Error updating issue metadata: `, err);
    return badImplementationRequest('Error updating issue metadata.');
  }
};

exports.updateViews = async issueId => {
  try {
    const issueViews = await updateIssueViews(issueId);
    if (issueViews) {
      return [
        200,
        { message: `${issueId} has ${issueViews} views.`, views: issueViews }
      ];
    }
    return badRequest(`No issues found to update clicks.`);
  } catch (err) {
    console.log('Error updating views on issue: ', err);
    return badImplementationRequest('Error updating views.');
  }
};

exports.deleteIssueById = async issueId => {
  try {
    const issue = await getIssueById(issueId);
    if (issue) {
      const { title } = issue;
      await deleteIssueByKey(title);
      const deletedIssue = await deleteIssueById(issueId);
      if (deletedIssue) {
        return [204];
      }
    }
    return badRequest(`No issue found with id provided.`);
  } catch (err) {
    console.log('Error deleting issue by id: ', err);
    return badImplementationRequest('Error deleting issue by id.');
  }
};
