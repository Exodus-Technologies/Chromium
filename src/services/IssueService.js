'use strict';

import formidable from 'formidable';
import {
  uploadArchiveToS3Location,
  doesS3BucketExist,
  doesS3ObjectExist,
  deleteIssueByKey,
  copyS3Object,
  getObjectUrlFromS3,
  doesIssueS3BucketExist,
  createCoverImageS3Bucket,
  createIssueS3Bucket,
  doesCoverImageS3BucketExist,
  deleteCoverImageByKey
} from '../aws';
import {
  COVERIMAGE_MIME_TYPE,
  ISSUE_MIME_TYPE,
  MAX_FILE_SIZE
} from '../constants';
import {
  createIssue,
  updateIssueViews,
  getIssueById,
  deleteIssueById,
  getIssueByTitle,
  updateIssue,
  getIssues,
  getTotal
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function removeSpaces(str) {
  return str && str.replace(/\s+/g, '');
}

exports.getPayloadFromRequest = async req => {
  const form = formidable({ multiples: true, maxFileSize: MAX_FILE_SIZE });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      if (isEmpty(fields)) reject('Form is empty.');
      const file = { ...fields, key: removeSpaces(fields.title) };
      if (!isEmpty(files)) {
        const { filepath: issuePath, mimetype: issueType } = files['file'];
        const { filepath: coverImagePath, mimetype: coverImageType } =
          files['coverImage'];
        resolve({
          ...file,
          issuePath,
          issueType,
          coverImagePath,
          coverImageType
        });
      } else {
        resolve(file);
      }
    });
    form.on('error', err => {
      console.log('Error on form parse: ', err);
    });
    form.on('end', () => {
      console.log('Form is finished processing.');
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
          issues
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
    const {
      title,
      author,
      description,
      key,
      issuePath,
      issueType,
      coverImagePath,
      coverImageType,
      categories,
      avaiableForSale
    } = archive;
    if (!issuePath) {
      return badRequest('File must be provided to upload.');
    }
    if (issuePath && issueType !== ISSUE_MIME_TYPE) {
      return badRequest('File must be a file with a pdf extention.');
    }
    if (!coverImagePath) {
      return badRequest('Cover image must be provided to upload.');
    }
    if (coverImagePath && coverImageType !== COVERIMAGE_MIME_TYPE) {
      return badRequest('File must be a file with a image extension.');
    }
    if (!title) {
      return badRequest('Must have file title associated with file upload.');
    }
    if (!description) {
      return badRequest(
        'Must have file description associated with file upload.'
      );
    }
    if (!author) {
      return badRequest(
        'Must have author of file associated with file upload.'
      );
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
      const isIssueBucketAvaiable = await doesIssueS3BucketExist();
      const isCoverImageBucketAvaiable = await doesCoverImageS3BucketExist();
      if (!isIssueBucketAvaiable && !isCoverImageBucketAvaiable) {
        await createIssueS3Bucket();
        await createCoverImageS3Bucket();
      } else {
        const { issueLocation, coverImageLocation } =
          await uploadArchiveToS3Location(archive);

        const body = {
          title,
          author,
          description,
          key,
          ...(categories && {
            categories: categories.split(',').map(item => item.trim())
          }),
          avaiableForSale,
          url: issueLocation,
          coverImage: coverImageLocation
        };
        const savedIssue = await createIssue(body);
        return [
          200,
          { message: 'Issue uploaded to s3 with success', issue: savedIssue }
        ];
      }
    }
  } catch (err) {
    console.log(`Error uploading issue to s3: `, err);
    return badImplementationRequest('Error uploading issue to s3.');
  }
};

exports.updateIssue = async archive => {
  try {
    const { title, filepath, issueId, description, author, mimetype } = archive;
    if (description && description.length > 255) {
      return badRequest(
        'Description must be provided and less than 255 characters long.'
      );
    }
    const issue = await getIssueById(issueId);
    if (issue) {
      const newKey = removeSpaces(title);
      if (newKey !== issue.key) {
        await copyS3Object(issue.key, newKey);
        const s3Location = getObjectUrlFromS3(newKey);
        const body = {
          title,
          issueId,
          description,
          author,
          key: newKey,
          url: s3Location
        };
        await updateIssue(body);
        deleteIssueByKey(issue.key);
        return [
          200,
          {
            message: 'Issue updated in s3 with success',
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
      if (filepath) {
        if (mimetype !== ISSUE_MIME_TYPE) {
          return badRequest('File must be a file with a pdf extention.');
        }
        const isBucketAvaiable = await doesS3BucketExist();
        if (isBucketAvaiable) {
          const s3Object = await doesS3ObjectExist(newKey);
          if (s3Object) {
            deleteIssueByKey(newKey);
          }
          const s3Location = await uploadArchiveToS3Location(archive);
          const body = {
            title,
            issueId,
            description,
            key: newKey,
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
        const url = await getObjectUrlFromS3(newKey);
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
        {
          message: `issueId: ${issueId} has ${issueViews} views.`,
          views: issueViews
        }
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
      const { key } = issue;
      await deleteIssueByKey(key);
      await deleteCoverImageByKey(key);
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

exports.getTotal = async query => {
  try {
    const issues = await getTotal(query);
    if (issues) {
      return [
        200,
        {
          message: 'Successful fetch for get total video with query params.',
          total_issue: issues
        }
      ];
    }
    return badRequest(`No issue found with selected query params.`);
  } catch (err) {
    console.log('Error getting all issues: ', err);
    return badImplementationRequest('Error getting issues.');
  }
};
