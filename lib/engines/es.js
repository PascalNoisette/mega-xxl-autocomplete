const axios = require('axios');
const https = require('https');

module.exports = function (service) {
  return Object.assign({}, service, {
    request: (clitentReq, clientRes) => {
      delete clitentReq.headers.authorization;
      return axios({
        auth: {
          username: service.credentials.split(':')[0],
          password: service.credentials.split(':')[1]
        },
        headers: clitentReq.headers,
        method: clitentReq.method,
        url: service.url + clitentReq.url.replace("/api/search/", "/"),
        responseType: 'stream',
        data: clitentReq.body,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
        .then((backendRes) => {
          backendRes.data.pipe(clientRes);
        })
        .catch((err) => {clientRes.status(err.response.status).send(err.response.statusText)});
    }
  });
};
