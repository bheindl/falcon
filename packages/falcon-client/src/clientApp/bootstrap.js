import deepMerge from 'deepmerge';
import bootstrap from 'app-path/bootstrap.js';

const config = deepMerge(
  {
    logLevel: 'error',
    serverSideRendering: true,
    apolloClient: {
      httpLink: {
        uri: 'http://localhost:4000/graphql'
      },
      config: {}
    },
    googleTagManager: {
      id: null
    },
    i18n: {
      lng: 'en',
      ns: ['common'],
      fallbackLng: 'en',
      whitelist: ['en'],
      // available: languages taken from falcon-server
      debug: false
    }
  },
  bootstrap.config || {},
  { arrayMerge: (destination, source) => source }
);

export default {
  config,
  configSchema: {
    defaults: {
      config
    }
  },

  onServerCreated: bootstrap.onServerCreated || (() => {}),
  onServerInitialized: bootstrap.onServerInitialized || (() => {}),
  onServerStarted: bootstrap.onServerStarted || (() => {})
};
