'use strict';

import fs from 'fs';
import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  HeadObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  CopyObjectCommand
} from '@aws-sdk/client-s3';
import config from '../config';
import { DEFAULT_FILE_EXTENTION } from '../constants';

const { aws } = config.sources;
const { accessKeyId, secretAccessKey, s3BucketName, region } = aws;

// Create S3 service object
const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
    region
  }
});

const getFileContentFromPath = path => {
  return new Promise(async (resolve, reject) => {
    try {
      fs.readFile(path, function (err, buffer) {
        if (err) {
          reject(err);
        }
        resolve(buffer);
      });
    } catch (err) {
      console.log(`Error getting file: ${path} `, err);
      reject(err);
    }
  });
};

export const doesS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
      const bucket = Buckets.some(bucket => bucket.Name === s3BucketName);
      resolve(bucket);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'doesS3BucketExist',
        requestId,
        cfId,
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
        Bucket: s3BucketName,
        Key: `${key}.${DEFAULT_FILE_EXTENTION}`
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
        Bucket: s3BucketName,
        CopySource: `${s3BucketName}/${oldKey}.${DEFAULT_FILE_EXTENTION}`,
        Key: `${newKey}.${DEFAULT_FILE_EXTENTION}`
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

export const getObjectUrlFromS3 = fileName => {
  return `https://${s3BucketName}.s3.amazonaws.com/${fileName}.${DEFAULT_FILE_EXTENTION}`;
};

export const createS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3BucketName
      };
      await s3Client.send(new CreateBucketCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'createS3Bucket',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const deleteIssueByKey = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3BucketName,
        Key: `${key}.${DEFAULT_FILE_EXTENTION}`
      };
      await s3Client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'deleteIssueByKey',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

const uploadToS3 = (fileContent, key) => {
  return new Promise(async (resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: s3BucketName,
      Key: `${key}.${DEFAULT_FILE_EXTENTION}`, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read'
    };
    try {
      const data = await s3Client.send(new PutObjectCommand(params));
      resolve(data);
    } catch (err) {
      console.log(`Error uploading file to s3 bucket: ${s3BucketName} `, err);
      reject(err);
    }
  });
};

export const uploadArchiveToS3Location = async file => {
  return new Promise(async (resolve, reject) => {
    try {
      const { title, filepath } = file;
      const fileContent = await getFileContentFromPath(filepath);
      await uploadToS3(fileContent, title);
      const fileLocation = getObjectUrlFromS3(title);
      resolve(fileLocation);
    } catch (err) {
      console.log(`Error uploading archive to s3 bucket: ${file} `, err);
      reject(err);
    }
  });
};
