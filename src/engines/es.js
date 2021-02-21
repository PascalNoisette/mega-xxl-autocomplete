const proxy = require('../Proxy');

module.exports = function (service) { 
  return Object.assign({}, service, {
    onselect: value => {
      window.location = service.location + value.source[service.source]
    },
    request: (clitentReq, clientRes) => {
      return proxy(service.url, service.credentials, clitentReq, clientRes);
    }
  });
}