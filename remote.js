'use strict';

require('dotenv').config();
const express = require('express');
const app = express();

module.exports = (app, httpPort) => {
  app.enable('trust proxy');

  app.use ((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      const proxypath = process.env.PROXY_PASS || ''
      res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
    }
  });

  app.listen(httpPort);
};