/* eslint-disable no-restricted-syntax, no-await-in-loop */
const { Events } = require('@deity/falcon-server-env');
const BaseContainer = require('./BaseContainer');

/**
 * @typedef {object} ApiInstanceConfig
 * @property {string} name Api short-name (example: "api-wordpress")
 * @property {string} package Node package path (example: "@deity/falcon-wordpress-api")
 * @property {object} config Config object to be passed to Api Instance constructor
 */

/**
 * Api Engine acts as a container for API instances:
 * - manages all the instances
 * - returns the instances as dataSources (required by Apollo Server)
 */
module.exports = class ApiContainer extends BaseContainer {
  /**
   * Create an instance.
   * @param {EventEmitter2} eventEmitter EventEmitter
   */
  constructor(eventEmitter) {
    super(eventEmitter);
    /** @type {Map<string, ApiDataSource>} Array with API instances */
    this.dataSources = new Map();
    this.resolvers = [];
  }

  /**
   * Instantiates apis based on passed configuration
   * @param {object<string, ApiInstanceConfig>} apis Key-value list of APIs configuration
   * @returns {undefined}
   */
  async registerApis(apis = {}) {
    for (const apiKey in apis) {
      if (Object.prototype.hasOwnProperty.call(apis, apiKey)) {
        const api = apis[apiKey];

        const { package: pkg, config = {} } = api;
        const ApiClass = this.importModule(pkg);
        if (!ApiClass) {
          return;
        }

        // If imported ApiClass has a defined "getExtraResolvers" static method
        if (ApiClass.getExtraResolvers) {
          const apiGetter = resolve => async (root, params, context, info) => {
            if (!(apiKey in context.dataSources)) {
              throw new Error(`"${apiKey}" API not found `);
            }
            return resolve(context.dataSources[apiKey], root, params, context, info);
          };
          this.resolvers.push(ApiClass.getExtraResolvers(apiGetter));
        }

        const apiInstanceCb = apolloServerConfig => {
          /** @type {ApiDataSource} */
          const apiInstance = new ApiClass({
            config,
            name: apiKey,
            apiContainer: this,
            eventEmitter: this.eventEmitter,
            gqlServerConfig: apolloServerConfig
          });

          this.eventEmitter.emit(Events.API_DATA_SOURCE_REGISTERED, {
            instance: apiInstance,
            name: apiInstance.name
          });

          this.logger.debug(`"${apiInstance.name}" API DataSource instantiated`);

          return apiInstance;
        };
        this.dataSources.set(apiKey, apiInstanceCb);
      }
    }
  }
};
