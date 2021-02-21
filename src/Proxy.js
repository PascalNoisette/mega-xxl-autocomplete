const axios = require('axios');
const https = require('https');

module.exports = (backendUrl, backendCredentials, clitentReq, clientRes) => {
  axios({
    auth: {
      username: backendCredentials.split(':')[0],
      password: backendCredentials.split(':')[1]
    },
    headers: clitentReq.headers,
    method: clitentReq.method,
    url: backendUrl + clitentReq.url,
    responseType:'stream',
    data:clitentReq.body,
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  })
  .then(backendRes => {
    backendRes.data.pipe(clientRes);
  })
  .catch(err => console.log(err));
}