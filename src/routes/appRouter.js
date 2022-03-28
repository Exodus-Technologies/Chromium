'use strict';

import express from 'express';
import { cache } from '../middlewares';

const { Router } = express;

const router = Router();

router.get('/issue-service/', cache(), (_, res) => {
  res
    .status(200)
    .send({ message: 'Welcome to Chromium Issue Manager Service!' });
});

router.get('/issue-service/probeCheck', cache(), (_, res) => {
  res
    .status(200)
    .send({ message: 'Chromium Issue Manager service up and running!' });
});

export default router;
