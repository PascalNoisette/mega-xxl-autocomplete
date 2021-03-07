const axios = require('axios');

module.exports = function (service) {
  return Object.assign({}, service, {
    request: (clitentReq, clientRes) => {
      const keyword = JSON.parse(clitentReq.body.split('\n')[1]).query.bool
        .must[0].bool.must.bool.should[0].multi_match.query;

      axios({
        url:
          service.url +
          '/search.json?key=' +
          service.credentials +
          '&q=' +
          encodeURI(keyword),
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then((results) => {
          clientRes.send({
            responses: [
              {
                hits: {
                  total: { value: results.data.results.length },
                  hits: results.data.results.map((x) => {
                    x.title =
                      '#' +
                      x.id +
                      ' ' +
                      x.title.substring(x.title.indexOf(':') + 1);
                    x._source = Object.assign({}, x);
                    return x;
                  })
                }
              }
            ]
          });
        })
        .catch((err) => console.log(err));
    }
  });
};
