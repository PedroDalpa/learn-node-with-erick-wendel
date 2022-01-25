const app = require('./api');

(async () => {
  const server = await app;
  server.start();

  console.info('server is running on port:', server.info.port);
})()