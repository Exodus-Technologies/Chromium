'use strict';

require('dotenv').config();

const config = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  defaultCacheTtl: parseInt(process.env.DEFAULT_CACHE_TTL, 10),
  sources: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      s3IssueBucketName: process.env.S3_ISSUE_BUCKET_NAME,
      s3CoverImageBucketName: process.env.S3_COVERIMAGE_BUCKET_NAME
    },
    database: {
      clusterName: process.env.CLUSTER_NAME,
      dbName: process.env.DB_NAME,
      dbUser: process.env.DB_USER,
      dbPass: process.env.DB_PASS,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  }
};

export default config;
