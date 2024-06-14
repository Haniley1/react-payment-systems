const {alias, configPaths} = require('react-app-rewire-alias');
const {addDecoratorsLegacy, override} = require("customize-cra");

module.exports = override(
  addDecoratorsLegacy(),
  (config, env) => {
    alias({
      ...configPaths('tsconfig.paths.json'),
    })(config);

    return config;
  }
);
