const Bot = require('nodemw');
const fs = require ('fs');

if (typeof(fs.existsSync) == "undefined") {
  fs.existsSync = ()=>{};
}

module.exports = function (service) {

  
  return Object.assign({}, service, {
    mediawikibot:null,
    request: function (clitentReq, clientRes) {
      this.loginRequest(() => this.searchRequest(clitentReq, clientRes));
    },
    loginRequest: (callback) => {
      if (this.mediawikibot != null) {
        return callback();
      }
      const conf = {
        "protocol": "https",  // default to 'http'
        "server": service.url.split("://")[1],  // host name of MediaWiki-powered site
        "path": "",                  // path to api.php script
        "debug": true,                // is more verbose when set to true
        "userAgent": "MegaXXlAutocomplete",      // define custom bot's user agent
        "concurrency": 3               // how many API requests can be run in parallel (defaults to 3)
      };
      if (service.credentials) {
        conf.username = service.credentials.split(":")[0];             // account to be used when logIn is called (optional)
        conf.password = service.credentials.split(":")[1];             // password to be used when logIn is called (optional)
      }
      this.mediawikibot = new Bot(conf);
      if (service.credentials) {
        this.mediawikibot.logIn( function ( err ) {
        if ( err ) {
          console.log( err );
          return;
        }
        callback();
      });
    } else {
      callback();
    }
    },
    searchRequest: (clitentReq, clientRes) => {
      
      const keyword = JSON.parse(clitentReq.body.split('\n')[1]).query.bool.must[0].bool.must.bool.should[0].multi_match.query;
      
      this.mediawikibot.api.call(
        {
          action: 'query',
          list: 'search',
          srwhat: 'text',
          srsearch: keyword
        },
        ( err, results ) => {
          if (err) {
            return clientRes.send(err);
          }
        clientRes.send(
          {
            "responses":
            [
              {
                "hits":{
                  "total":{"value":results.searchinfo.totalhits},
                  "hits": results.search.map((x)=>{
                    x._source = Object.assign({}, x);
                    return x;
                  })
                }
              }
            ]
          });
      });
    }
  });
}