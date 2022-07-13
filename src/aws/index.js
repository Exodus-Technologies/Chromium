'use strict';

import fs from 'fs';
import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  CreateBucketCommand,
  CopyObjectCommand
} from '@aws-sdk/client-s3';
import config from '../config';
import {
  DEFAULT_COVERIMAGE_FILE_EXTENTION,
  DEFAULT_PDF_FILE_EXTENTION
} from '../constants';

const { aws } = config.sources;
const {
  accessKeyId,
  secretAccessKey,
  s3IssueBucketName,
  region,
  s3CoverImageBucketName
} = aws;

// Create S3 service object
const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
    region
  }
});

export const createIssueS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3IssueBucketName
      };
      await s3Client.send(new CreateBucketCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'createS3Bucket',
        requestId,
        cfId,
        bucketName: s3IssueBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const createCoverImageS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3CoverImageBucketName
      };
      await s3Client.send(new CreateBucketCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'createS3Bucket',
        requestId,
        cfId,
        bucketName: s3CoverImageBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

const getFileContentFromPath = path => {
  return new Promise(async (resolve, reject) => {
    try {
      fs.readFile(path, function (err, buffer) {
        const content = { file: buffer };
        if (err) {
          reject(err);
        }
        resolve(content);
      });
    } catch (err) {
      console.log(`Error getting file: ${path} `, err);
      reject(err);
    }
  });
};

export const doesIssueS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
      const bucket = Buckets.some(bucket => bucket.Name === s3IssueBucketName);
      resolve(bucket);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'doesS3BucketExist',
        requestId,
        cfId,
        bucketName: s3IssueBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesCoverImageS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
      const bucket = Buckets.some(
        bucket => bucket.Name === s3CoverImageBucketName
      );
      resolve(bucket);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'doesS3BucketExist',
        requestId,
        cfId,
        bucketName: s3CoverImageBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesS3ObjectExist = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3IssueBucketName,
        Key: `${key}.${DEFAULT_PDF_FILE_EXTENTION}`
      };
      const s3Object = await s3Client.send(new HeadObjectCommand(params));
      resolve(s3Object);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'doesS3ObjectExist',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const copyS3Object = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3IssueBucketName,
        CopySource: `${s3IssueBucketName}/${oldKey}.${DEFAULT_PDF_FILE_EXTENTION}`,
        Key: `${newKey}.${DEFAULT_PDF_FILE_EXTENTION}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'copyS3Object',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const getObjectUrlFromS3 = (fileName, isIssue = true) => {
  const bucketName = isIssue ? s3IssueBucketName : s3CoverImageBucketName;
  const extension = isIssue
    ? DEFAULT_PDF_FILE_EXTENTION
    : DEFAULT_COVERIMAGE_FILE_EXTENTION;
  return `https://${bucketName}.s3.amazonaws.com/${fileName}.${extension}`;
};

export const deleteIssueByKey = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3IssueBucketName,
        Key: `${key}.${DEFAULT_PDF_FILE_EXTENTION}`
      };
      await s3Client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'deleteIssueByKey',
        requestId,
        cfId,
        key,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const deleteCoverImageByKey = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3CoverImageBucketName,
        Key: `${key}.${DEFAULT_COVERIMAGE_FILE_EXTENTION}`
      };
      await s3Client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'deleteCoverImageByKey',
        requestId,
        cfId,
        key,
        extendedRequestId
      });
      reject(err);
    }
  });
};

const uploadIssueToS3 = (fileContent, key) => {
  return new Promise(async (resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: s3IssueBucketName,
      Key: `${key}.${DEFAULT_PDF_FILE_EXTENTION}`, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read'
    };
    try {
      const data = await s3Client.send(new PutObjectCommand(params));
      resolve(data);
    } catch (err) {
      console.log(
        `Error uploading file to s3 bucket: ${s3IssueBucketName} `,
        err
      );
      reject(err);
    }
  });
};

const uploadCoverImageToS3 = (fileContent, key) => {
  return new Promise(async (resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: s3CoverImageBucketName,
      Key: `${key}.${DEFAULT_COVERIMAGE_FILE_EXTENTION}`, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read'
    };
    try {
      const data = await s3Client.send(new PutObjectCommand(params));
      resolve(data);
    } catch (err) {
      console.log(
        `Error uploading file to s3 bucket: ${s3CoverImageBucketName} `,
        err
      );
      reject(err);
    }
  });
};

export const uploadArchiveToS3Location = async archive => {
  return new Promise(async (resolve, reject) => {
    try {
      const { key, issuePath, coverImagePath } = archive;
      const { file: issueFile } = await getFileContentFromPath(issuePath);
      const { file: coverImageFile } = await getFileContentFromPath(
        coverImagePath,
        false
      );
      await uploadIssueToS3(issueFile, key);
      await uploadCoverImageToS3(coverImageFile, key);
      const issueLocation = getObjectUrlFromS3(key);
      const coverImageLocation = getObjectUrlFromS3(key, false);
      resolve({ issueLocation, coverImageLocation });
    } catch (err) {
      console.log(`Error uploading archive to s3 bucket:`, err);
      reject(err);
    }
  });
};
