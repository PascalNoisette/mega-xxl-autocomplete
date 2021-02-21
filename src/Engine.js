
const engine = {
  choices:[]
};


// This condition actually should detect if it's an Node environment
if (typeof require.context === 'undefined') {
  const fs = require('fs');
  const path = require('path');

  require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.js$/) => {
    const files = {};

    function readDirectory(directory) {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.resolve(directory, file);

        if (fs.statSync(fullPath).isDirectory()) {
          if (scanSubDirectories) readDirectory(fullPath);

          return;
        }

        if (!regularExpression.test(fullPath)) return;

        files[fullPath] = true;
      });
    }

    readDirectory(path.resolve(__dirname, base));

    function Module(file) {
      return require(file);
    }

    Module.keys = () => Object.keys(files);

    return Module;
  };
}
const requireComponent = require.context(
  './engines',
  true,
  /\w+\.(js)$/
);
requireComponent.keys().forEach(filePath => {
  const filename = filePath.split(/[\\/]/).pop().split(/[.]/).reverse().pop()
    const Component = requireComponent(filePath);
    engine[filename]=Component;
    engine.choices.push({id: filename, name: filename});
});

module.exports = engine;