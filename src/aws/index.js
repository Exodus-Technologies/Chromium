'use strict';

import path from 'path';
import fs from 'fs';
import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  HeadObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import config from '../config';

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

const getFileContentFromUrl = (url, path, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const destinationPath = `${path}/${name}`;
      const file = fs.createWriteStream(destinationPath);
      https.get(url, function (response) {
        response.pipe(file);
      });
      const fileContent = await getFileContentFromPath(destinationPath);
      resolve(fileContent);
    } catch (err) {
      console.log(`Error getting file from url: ${url} `, err);
      reject(err);
    }
  });
};

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
        Key: key
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

export const getObjectUrlFromS3 = fileName => {
  return `https://${s3BucketName}.s3.amazonaws.com/${fileName}`;
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

export const deleteVideoByKey = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3BucketName,
        Key: key
      };
      await s3Client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'deleteVideoByKey',
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
      Key: key, // File name you want to save as in S3
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
    const { title, url, filepath } = file;
    // Read content from the file
    const uploadsPath = path.join(process.cwd(), `./uploads/`);

    let fileContent = '';
    if (filepath) {
      fileContent = await getFileContentFromPath(filepath);
    }
    if (url) {
      fileContent = await getFileContentFromUrl(url, uploadsPath, title);
    }

    try {
      await uploadToS3(fileContent, title);
      const fileLocation = getObjectUrlFromS3(title);
      if (url) {
        fs.unlinkSync(tmpArchivePath);
      }
      resolve(fileLocation);
    } catch (err) {
      console.log(`Error uploading archive to s3 bucket: ${file} `, err);
      reject(err);
    }
  });
};
