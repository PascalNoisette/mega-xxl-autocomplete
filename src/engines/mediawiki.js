const Bot = require('nodemw');
const fs = require ('fs');

if (typeof(fs.existsSync) == "undefined") {
  fs.existsSync = ()=>{};
}

module.exports = function (service) {
  let ready = false;
  let mediawikibot;
  
  try {
  mediawikibot = new Bot( {
    "protocol": "https",  // default to 'http'
    "server": service.url.split("://")[1],  // host name of MediaWiki-powered site
    "path": "/",                  // path to api.php script
    "debug": true,                // is more verbose when set to true
    "username": service.credentials.split(":")[0],             // account to be used when logIn is called (optional)
    "password": service.credentials.split(":")[1],             // password to be used when logIn is called (optional)
    "userAgent": "MegaXXlAutocomplete",      // define custom bot's user agent
    "concurrency": 3               // how many API requests can be run in parallel (defaults to 3)
} );
mediawikibot.logIn( function ( err ) {
	if ( err ) {
		console.log( err );
		return;
	}
  ready = true;
});
} catch (e) {
  console.log(e);
}
  return Object.assign({}, service, {
    onselect: value => {
      window.location = service.location + value.source[service.source]
    },
    request: (clitentReq, clientRes) => {
      
      const keyword = JSON.parse(clitentReq.body.split('\n')[1]).query.bool.must[0].bool.must.bool.should[0].multi_match.query;
      if (!ready) {
        return [];
      }
      
      mediawikibot.api.call(
        {
          action: 'query',
          list: 'search',
          srwhat: 'text',
          srnamespace: '*',
          srsearch: keyword
        },
        ( err, results ) => {
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
