'use strict';

const createMiddleware = require('@apidevtools/swagger-express-middleware');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const contentRangeMiddleware = require('./middleware/content-range');
const requireGlob = require('require-glob');
const process = require('process');
const Engines = requireGlob.sync(['engines/*.js']);
const FileDataStore = require('./middleware/cypher-datastore');
const basicAuth = require('./middleware/basic-auth');
// Create an Express app
const app = express();

// Initialize Swagger Express Middleware with our Swagger file
let swaggerFile = path.join(__dirname, '/definition/swagger.yaml');
// Create a custom data store
let myDB = new FileDataStore(process.cwd() + '/data');

createMiddleware(swaggerFile, app, (err, middleware) => {
  app.use(
    bodyParser.text({ type: 'application/x-ndjson' }),
    contentRangeMiddleware
  );

  myDB.getCollection('/services', function callback(err, services) {
    if (err) {
      console.log(err.message);
      return;
    }
    services.map(function (sv) {
      app.post('/' + sv.data.app + '/_msearch', function (req, res) {
        let service = null;
        if (service == null) {
          myDB.getCollection('/services', function callback(err, shx) {
            service = Engines[sv.data.engine](
              shx.filter((x) => x.name == sv.name).pop().data
            );
            service.request(req, res);
          });
          return;
        }
        return service.request(req, res);
      });
    });

    /**
     * Get engines list
     */
    app.get('/engines', function (req, res) {
      res.send(Object.keys(Engines));
    });

    // Add all the Swagger Express Middleware, or just the ones you need.
    // NOTE: Some of these accept optional options (omitted here for brevity)
    app.use(
      express.static(path.join(__dirname, 'build')),
      basicAuth(myDB),
      middleware.metadata(),
      middleware.CORS(),
      middleware.files(),
      middleware.parseRequest(),
      middleware.validateRequest(),
      middleware.mock(myDB)
    );

    // Start the app
    app.listen(8000, () => {
      console.log('The middleware is now running');
    });
  });
});
