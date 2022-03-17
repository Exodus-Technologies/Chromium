'use strict';

import server from './server';
import config from './config';
import models from './models';
import { generateDBUri } from './mongodb';

/**
 * Start web server
 */
const startServer = async () => {
  const { PORT, HOST } = config;
  try {
    await server.listen(PORT, HOST);
    console.log(`Server listening on port: ${PORT}`);
  } catch (err) {
    console.log(`Server started with error: ${err}`);
    throw err;
  }
};

/**
 * Connect to mongodb database
 */
const connectDB = async () => {
  const { options } = config.sources.database;
  const { source } = models;
  const uri = generateDBUri();
  try {
    await source.connect(uri, options);
  } catch (e) {
    console.log(`Error connecting to db: ${e}`);
    throw e;
  }
};

const init = async () => {
  console.log('Starting app...');
  await connectDB();
  await startServer();
};

init().catch(err => {
  console.log(`Error starting application: ${err}`);
});

process
  .on('unhandledRejection', reason => {
    console.log(`Unhandled rejection, reason: ${reason.stack}`);
  })
  .on('uncaughtException', err => {
    console.log(err, 'Uncaught exception thrown.');
    process.exit(1);
  })
  .on('SIGINT', () => {
    /**
     * Close connection to db
     */
    const { source } = models;
    source.disconnect().catch(err => {
      process.exit(err ? 1 : 0);
    });
    console.log('Disconnecting from database and shutting down application.');
  });
