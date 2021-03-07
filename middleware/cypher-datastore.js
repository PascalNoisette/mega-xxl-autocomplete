const swagger = require('@apidevtools/swagger-express-middleware');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
let password = '';

function CypherDataStore(path) {
  swagger.FileDataStore.prototype.constructor.call(this, path);
}

module.exports = CypherDataStore;

// Inheritance
CypherDataStore.prototype = Object.create(swagger.FileDataStore.prototype);

CypherDataStore.prototype.setPassword = function (customerDefined) {
  password = customerDefined;
};

/**
 * Overrides {@link DataStore#__openDataStore} to return data from a JSON file.
 *
 * @protected
 */
CypherDataStore.prototype.__openDataStore = function (collection, callback) {
  swagger.FileDataStore.prototype.__openDataStore.call(
    this,
    collection,
    function (err, rsx) {
      rsx.map((element) => {
        if (element.data.encrypted) {
          var decipher = crypto.createDecipher(algorithm, password);
          var dec = decipher.update(element.data.encrypted, 'hex', 'utf8');
          dec += decipher.final('utf8');
          try {
            delete element.data.encrypted;
            Object.assign(element.data, JSON.parse(dec));
          } catch (e) {
            console.log(e);
          }
        }
      });
      callback(err, rsx);
    }
  );
};

/**
 * Overrides {@link DataStore#__saveDataStore} to store data in a a JSON file.
 *
 * @protected
 */
CypherDataStore.prototype.__saveDataStore = function (
  collection,
  resources,
  callback
) {
  resources.forEach((element) => {
    if (element.data.credentials) {
      var cipher = crypto.createCipher(algorithm, password);
      var crypted = cipher.update(
        JSON.stringify({ credentials: element.data.credentials }),
        'utf8',
        'hex'
      );
      crypted += cipher.final('hex');
      element.data.encrypted = crypted;
      delete element.data.credentials;
    }
  });
  swagger.FileDataStore.prototype.__saveDataStore.call(
    this,
    collection,
    resources,
    function (err) {
      callback(err);
    }
  );
};
