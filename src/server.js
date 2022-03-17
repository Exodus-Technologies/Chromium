'use strict';

import http from 'http';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import noCache from 'nocache';
import cors from 'cors';
import responseTime from 'response-time';

import { requestResponse, errorHandler } from './utils';
import { appRouter } from './routes';

// Create the Express application object
const server = express();

// specify a single subnet
server.set('trust proxy', true);

//Cors middleware
server.use(cors());
console.log('CORS enabled.');

//Helmet middleware
server.use(helmet());
server.use(helmet.referrerPolicy());
console.log('Loaded helmet middleware.');

//No cache middleware
server.use(noCache());
console.log('Loaded no-cache middleware.');

//Compression middleware
server.use(compression());
console.log('Loaded compression middleware.');

//BodyParser middleware
server.use(express.urlencoded({ limit: '50Mb', extended: false }));
server.use(express.json({ limit: '50Mb' }));
console.log('Loaded body-parser middleware.');

// Response time middleware
server.use(responseTime());
console.log('Loaded response time middleware.');

//error handler middleware
server.use(errorHandler);
console.log('Loaded error handler middleware.');

//route middleware with request/response
server.use(requestResponse);
console.log('Loaded request/response middleware.');

//App middleware
server.use(appRouter);
console.log('Loaded server routes middleware.');

export default http.createServer(server);
