'use strict';

import express from 'express';
import { cache } from '../middlewares';
import { fancyTimeFormat } from '../utilities';

const { Router } = express;

const router = Router();

const { version } = require('../../package.json');

router.get('/issue-service/', cache(), (_, res) => {
  res
    .status(200)
    .send({ message: 'Welcome to Chromium Issue Manager Service!' });
});

router.get('/issue-service/probeCheck', (_, res) => {
  res.status(200).send({
    uptime: fancyTimeFormat(process.uptime()),
    date: new Date(),
    message: 'Chromium Issue Manager service up and running!',
    appVersion: version
  });
});

export default router;
