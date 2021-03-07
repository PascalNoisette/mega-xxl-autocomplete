const axios = require('axios');

module.exports = function (service) {
  return Object.assign({}, service, {
    request: (clitentReq, clientRes) => {
      const keyword = JSON.parse(clitentReq.body.split('\n')[1]).query.bool
        .must[0].bool.must.bool.should[0].multi_match.query;

      axios({
        url:
          service.url +
          encodeURI('"' + keyword.replace(/[":+-]/g, (m) => '\\' + m) + '"'),
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
                  total: { value: results.data.resultCount },
                  hits: Object.keys(results.data.results).reduce(
                    (hits, file) => {
                      results.data.results[file].forEach((element) => {
                        element.file = file + '#L' + element.lineNumber;
                        element.title =
                          '<div class="suggest-legend">' +
                          file
                            .split('/')
                            .filter((x) => x)
                            .splice(0, 2)
                            .join('/') +
                          '</div>' +
                          element.line;
                        element._source = Object.assign({}, element);
                        hits.push(element);
                      });
                      return hits;
                    },
                    []
                  )
                }
              }
            ]
          });
        })
        .catch((err) => console.log(err));
    }
  });
};
