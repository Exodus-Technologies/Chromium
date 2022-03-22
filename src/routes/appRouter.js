'use strict';

import express from 'express';

const { Router } = express;

const router = Router();

router.get('/issue-service/', (_, res) => {
  res
    .status(200)
    .send({ message: 'Welcome to Chromium Issue Manager Service!' });
});

router.get('/issue-service/probeCheck', (_, res) => {
  res
    .status(200)
    .send({ message: 'Chromium Issue Manager service up and running!' });
});

export default router;
