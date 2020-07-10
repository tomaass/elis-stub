const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

let counter = 0;

const options = {
  target: 'https://elis.develop.r8.lol/',
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res, next) => {
    const path = proxyRes.client.parser.outgoing.path;
    if (path.includes('annotations') && path.includes('page_size=15')) {
      counter = counter + 1;
      if (counter % 2) {
        console.log('canceling response ', next);
        proxyRes.statusCode = 408;
      }
    }
  },
};

const exampleProxy = createProxyMiddleware(options);

const app = express();

app.use('/api/v1', exampleProxy);

app.listen(3001);
