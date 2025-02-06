// Next.js configuration
const path = require('path');
module.exports = {
    reactStrictMode: true,
    compiler: {
      styledComponents: true,
    },
    webpack: (config, { isServer }) => {
      config.experiments = {  topLevelAwait: true, layers: true };
      if (!isServer) {
        // Ensure that all imports of 'yjs' resolve to the same instance
        config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs')
      }
      return config;
    },
  };
  