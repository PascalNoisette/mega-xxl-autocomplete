
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const Engines = require('./src/Engine');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.text( { type: 'application/x-ndjson' } ));
app.use(bodyParser.json());

/**
 * Load configuration (not in git)
 */
const services = [];
fs.readFile("database.json", (err, data)=>{
  if (err) {
    console.log(err.message);
    return;
  }
  JSON.parse(data).map(x=>{services[x.id]=Engines[x.engine](x);});
  services.map(function (service) {
    app.post('/' + service.app + '/_msearch', function (req, res) {
      return service.request(req, res);
    });
  });
});

/**
 * Get configuration entry
 */
app.get('/posts/:id', function (req, res) {
  res.send(services[req.params.id]);
});

/**
 * Edit configuration entry
 */
app.put('/posts/:id', function (req, res) {
  services[req.params.id] = req.body;
  fs.writeFile("database.json", JSON.stringify(services.filter(x=>x)), ()=>{res.status(200)});
});

/**
 * Add configuration entry
 */
app.post('/posts', function (req, res) {
  req.body.id = services.length;
  services.push(req.body);
  fs.writeFile("database.json", JSON.stringify(services.filter(x=>x)), ()=>{res.status(200)});
});

/**
 * List configuration entries
 */
app.get('/posts', function (req, res) {
  res.setHeader('Content-Range','bytes : 0-9/*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
  fs.readFile("database.json", (err, data)=>{
    if (err) {
      data = [];
    }
    res.send(data)
  });
});

/**
 * Serve React frontend
 */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(process.env.PORT || 8080);

process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
})