/**
 * @alias WebApp
 * @namespace IWEBAPP_
 */
var IWEBAPP_ = {};

/**
 * @enum {string}
 */
IWEBAPP_.HTTPMethod = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    UPDATE: "UPDATE",
    DELETE: "DELETE"
};

/**
 * @typedef {GoogleAppsScript.HTML.HtmlOutput} IWEBAPP_.HtmlOutput
 */

/**
 * @typedef {GoogleAppsScript.Content.TextOutput} IWEBAPP_.TextResponse
 */

/**
 * @typedef {IWEBAPP_.HtmlOutput | IWEBAPP_.TextResponse} IWEBAPP_.HTTPResponse
 */

/**
 * @template {string} Pattern
 * @typedef {`${string & { __brand: Pattern; }}`} IWEBAPP_.RegexMatchedString
 */

/**
 * @typedef {IWEBAPP_.RegexMatchedString<"/^/?[a-zA-Z0-9-/]*$/">} IWEBAPP_.HTTPPath
 */

/**
 * @typedef {Object} IWEBAPP_.HTTPInput
 * @property {string} queryString - The query string of the URL or null if no query string is specified.
 * @property {Object<string, string>} parameter - An object of key/value pairs corresponding to the request parameters. 
 *      Only the first value is returned for parameters with multiple values.
 * @property {Object<string, string[]>} parameters - An object similar to e.parameter, but with an array of values for each key.
 * @property {string} pathInfo - The URL path after /exec or /dev.
 * @property {string} contextPath - Should not be used, always an empty string.
 * @property {number} contentLength - Length of the request content for POST requests or -1 for GET requests.
 * @property {Object} postData - Details about the POST request body.
 * @property {number} [postData.length] - Similar to e.contentLength.
 * @property {string} [postData.type] - The MIME type of the POST content.
 * @property {string} postData.contents - The body of the POST request.
 * @property {string} postData.name - Always "postData".
 */

/**
 * @typedef {Object} IWEBAPP_.HTTPRequest
 * @property {IWEBAPP_.HTTPMethod} [method]
 * @property {Object} [parameter]
 * @property {IWEBAPP_.HTTPInput['postData']} [data]
 * @property {IWEBAPP_.HTTPInput} [httpInput]
 */

/**
 * @typedef {Object} IWEBAPP_.ControllerMethod
 * @property {string} path
 * @property {function(IWEBAPP_.HTTPRequest): IWEBAPP_.HTTPResponse} execute
 * @property {IWEBAPP_.HTTPMethod | IWEBAPP_.HTTPMethod[]} allowedMethods
 */

/**
 * @typedef {Object} MongoDBAtlasCollectionOptions
 * @property {string} dataSource
 * @property {string} database
 * @property {string} collection
 * @property {string} apiKey
 * @property {string} endpoint
 */

/**
 * @typedef {Object} UpdateResult
 * @property {number} matchedCount
 * @property {number} modifiedCount
 */

/**
 * @typedef {Object<string, any>} TFilter
 */

/**
 * @typedef {Object<string, any>} TUpdate
 */

/**
 * @typedef {Object<string, any>} TReplace
 */

/**
 * @typedef {Object<string, 0|1>} TProjection
 */

/**
 * @typedef {Array<{ $match: TFilter }>} TPipeline
 */

/**
 * @class
 */
IWEBAPP_.MongoDBAtlasClient = class {
    /**
     * @param {MongoDBAtlasCollectionOptions} options
     */
    constructor({ apiKey, endpoint, dataSource }) {
        this.apiKey = apiKey;
        this.endpoint = endpoint;
        this.dataSource = dataSource;
    }

    /**
     * @param {string} dbName
     * @returns {MongoDBAtlasDatabase}
     */
    database(dbName) {
        // Implementation here
    }
};

/**
 * @typedef {Object} MongoDBAtlasDatabaseOptions
 * @property {string} apiKey
 * @property {string} endpoint
 * @property {string} dataSource
 * @property {string} database
 */

/**
 * @class
 */
IWEBAPP_.MongoDBAtlasDatabase = class {
    /**
     * @param {MongoDBAtlasDatabaseOptions} options
     */
    constructor({ apiKey, endpoint, dataSource, database }) {
        this.apiKey = apiKey;
        this.endpoint = endpoint;
        this.dataSource = dataSource;
        this.database = database;
    }

    /**
     * @param {string} collectionName
     * @returns {MongoDBAtlasCollection<unknown>}
     */
    collection(collectionName) {
        // Implementation here
    }
};

/**
 * @class
 */
IWEBAPP_.BaseMongoDBAtlasQuery = class {
    /**
     * @param {string} apiKey
     * @param {string} endpoint
     */
    constructor(apiKey, endpoint) {
        this.apiKey = apiKey;
        this.endpoint = endpoint;
    }

    /**
     * @param {string} endPoint
     * @returns {this}
     */
    setEndpoint(endPoint) {
        // Implementation here
    }

    /**
     * @param {string} apiKey
     * @returns {this}
     */
    setApiKey(apiKey) {
        // Implementation here
    }

    /**
     * @param {Object} body
     * @param {string} method
     * @returns {Object}
     */
    basicOptions(body = {}, method = '') {
        // Implementation here
    }

    /**
     * @param {any} options
     * @param {string} [endpoint]
     * @returns {any}
     */
    query(options, endpoint) {
        // Implementation here
    }
};

/**
 * @class
 * @extends IWEBAPP_.BaseMongoDBAtlasQuery
 * @template T
 */
IWEBAPP_.MongoDBAtlasCollection = class extends IWEBAPP_.BaseMongoDBAtlasQuery {
    /**
     * @param {MongoDBAtlasCollectionOptions} options
     */
    constructor({ dataSource, database, collection, apiKey, endpoint }) {
        super(apiKey, endpoint);
        this.dataSource = dataSource;
        this.database = database;
        this.collection = collection;
    }

    /**
     * @param {TFilter} filter
     * @param {TPipeline} pipeline
     * @returns {any}
     */
    aggregate(filter, pipeline) {
        // Implementation here
    }

    /**
     * @param {TFilter} [filter]
     * @returns {T[] | null}
     */
    find(filter) {
        // Implementation here
    }

    /**
     * @param {TFilter} [filter]
     * @returns {T | null}
     */
    findOne(filter) {
        // Implementation here
    }

    /**
     * @param {T[]} data
     * @returns {any}
     */
    insertMany(data) {
        // Implementation here
    }

    /**
     * @param {T} data
     * @returns {any}
     */
    insertOne(data) {
        // Implementation here
    }

    /**
     * @param {TFilter} filter
     * @param {TUpdate} update
     * @returns {any}
     */
    updateMany(filter, update) {
        // Implementation here
    }

    /**
     * @param {TFilter} filter
     * @param {TUpdate} update
     * @returns {any}
     */
    updateOne(filter, update) {
        // Implementation here
    }

    /**
     * @param {TFilter} filter
     * @param {TReplace} replace
     * @returns {any}
     */
    replaceOne(filter, replace) {
        // Implementation here
    }

    /**
     * @param {TFilter} filter
     * @param {TReplace} replace
     * @returns {any}
     */
    replaceMany(filter, replace) {
        // Implementation here
    }

    /**
     * @param {TFilter} filter
     * @returns {any}
     */
    deleteMany(filter) {
        // Implementation here
    }

    /**
     * @param {TFilter} filter
     * @returns {any}
     */
    deleteOne(filter) {
        // Implementation here
    }

    /**
     * @param {Object} body
     * @param {string} method
     * @returns {Object}
     */
    options(body = {}, method = '') {
        // Implementation here
    }
};

/**
 * @namespace IWEBAPP.Web.Controller
 */

/**
 * @class
 */
IWEBAPP_.Controller = class {
    /**
     * @constructor
     */
    constructor() {
        this.defaultPath = '';
        this.ignoreMethod = [];
    }

    /**
     * @param {IWEBAPP_.HTTPRequest} [request]
     * @returns {IWEBAPP_.HTTPResponse}
     */
    index(request) {
        // Implementation here
    }

    /**
     * @param {any} request
     * @returns {IWEBAPP_.HTTPResponse}
     */
    error404(request) {
        // Implementation here
    }

    /**
     * @param {string} path
     * @returns {GoogleAppsScript.Content.TextOutput}
     */
    redirect(path) {
        // Implementation here
    }

    /**
     * @param {IWEBAPP_.HTTPMethod} [method]
     * @param {string} [path]
     * @param {IWEBAPP_.HTTPInput} [e]
     * @returns {IWEBAPP_.HTTPResponse}
     */
    execute(method, path, e) {
        // Implementation here
    }

    /**
     * @param {IWEBAPP_.HTTPMethod} [method]
     * @returns {Array<IWEBAPP_.ControllerMethod>}
     */
    allMethod(method) {
        // Implementation here
    }
};

/**
 * @namespace IWEBAPP.Web.JSONRPCServer
 */

/**
 * @typedef {Object} IWEBAPP_.ISession
 * @property {string} token
 * @property {Object} user
 * @property {string} user.username
 * @property {any} user.role
 */

/**
 * @typedef {Object} IWEBAPP_.IJSONRPCRequest
 * @property {string} jsonrpc
 * @property {any} [id]
 * @property {string} method
 * @property {Array<any>} params
 * @property {string} authToken
 */

/**
 * @typedef {Object} IWEBAPP_.IJSONRPCResponseError
 * @property {string} jsonrpc
 * @property {any} [id]
 * @property {Object} [error]
 * @property {any} error.code
 * @property {string} error.message
 */

/**
 * @typedef {Object} IWEBAPP_.IJSONRPCResponseSuccess
 * @property {string} jsonrpc
 * @property {any} [id]
 * @property {any} [result]
 */

/**
 * @typedef {IWEBAPP_.IJSONRPCResponseSuccess & IWEBAPP_.IJSONRPCResponseError} IWEBAPP_.IJSONRPCResponse
 */

/**
 * @class
 */
IWEBAPP_.JSONRPCServer = class {
    /**
     * @param {Object<string, Function>} [methodInfos]
     */
    constructor(methodInfos) {
        this.ignoreMethod = [];
        this.version = '';
        this.scriptApp = undefined;
    }

    /**
     * @returns {string}
     */
    getServiceHost() {
        // Implementation here
    }

    /**
     * @param {IWEBAPP_.IJSONRPCRequest} request
     * @returns {IWEBAPP_.IJSONRPCResponse}
     */
    execute(request) {
        // Implementation here
    }

    /**
     * @param {Object<string, Function>} methodInfos
     */
    registerMethod(methodInfos) {
        // Implementation here
    }

    /**
     * @param {string} authToken
     * @returns {IWEBAPP_.ISession | false}
     */
    verifyAuthToken(authToken) {
        // Implementation here
    }

    /**
     * @param {string} method
     * @param {Array<any>} params
     * @param {string} [authToken]
     * @returns {IWEBAPP_.HTTPInput | any}
     */
    genRPCHTTPInput(method, params, authToken) {
        // Implementation here
    }

    /**
     * @param {string} method
     * @param {Array<any>} params
     * @param {string} [authToken]
     * @returns {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions}
     */
    genRPCRequest(method, params, authToken) {
        // Implementation here
    }

    /**
     * @param {IWEBAPP_.HTTPInput} httpInput
     * @returns {boolean}
     */
    isRPCHTTPInput(httpInput) {
        // Implementation here
    }

    /**
     * @param {IWEBAPP_.HTTPInput} httpInput
     * @returns {any}
     */
    doPost(httpInput) {
        // Implementation here
    }

    /**
     * @param {string} method
     * @param {Array<any>} params
     * @param {string} [authToken]
     * @returns {IWEBAPP_.IJSONRPCResponse}
     */
    callWithAPI(method, params, authToken) {
        // Implementation here
    }
};

/**
 * @namespace IWEBAPP.Web.WebApp
 */

/**
 * @typedef {Object} IWEBAPP_.WebAppOptions
 * @property {GoogleAppsScript.HTML.HtmlService} htmlService
 * @property {GoogleAppsScript.Script.ScriptApp} scriptApp
 * @property {GoogleAppsScript.Properties.Properties} propertyScope
 */

/**
 * @class
 */
IWEBAPP_.WebApp = class {
    /**
     * @param {IWEBAPP_.WebAppOptions} options
     */
    constructor({ htmlService, scriptApp, propertyScope }) {
        this.scriptApp = scriptApp;
        this.HtmlService = htmlService;
        this.propertyScope = propertyScope;
        this.controllerMap = {};
        this.templateFolders = [];
    }

    /**
     * @param {IWEBAPP_.HTTPInput} e
     * @returns {IWEBAPP_.HTTPResponse}
     */
    doGet(e) {
        // Implementation here
    }

    /**
     * @param {IWEBAPP_.HTTPInput} e
     * @returns {IWEBAPP_.HTTPResponse}
     */
    doPost(e) {
        // Implementation here
    }

    /**
     * @param {IWEBAPP_.HTTPMethod} method
     * @param {IWEBAPP_.HTTPInput} e
     * @returns {IWEBAPP_.HTTPResponse}
     */
    controllerExecute(method, e) {
        // Implementation here
    }

    /**
     * @param {Object<string, typeof IWEBAPP_.Controller>} ctrlMap
     */
    registerControllerPath(ctrlMap) {
        // Implementation here
    }

    /**
     * @param {string} txt
     * @returns {IWEBAPP_.HTTPResponse}
     */
    textResponse(txt) {
        // Implementation here
    }

    /**
     * @param {any} object
     * @returns {IWEBAPP_.HTTPResponse}
     */
    jsonResponse(object) {
        // Implementation here
    }

    /**
     * @param {Array<typeof IWEBAPP_.Controller>} controllers
     */
    registerController(...controllers) {
        // Implementation here
    }

    /**
     * @param {GoogleAppsScript.HTML.HtmlTemplate|string} template
     * @param {Object<string, any>} [parameter]
     * @returns {IWEBAPP_.HTTPResponse}
     */
    renderTemplate(template, parameter) {
        // Implementation here
    }

    /**
     * @param {string} pathName
     * @returns {IWEBAPP_.Controller|null}
     */
    getController(pathName) {
        // Implementation here
    }

    /**
     * @param {string[]} folders
     */
    templatePath(...folders) {
        // Implementation here
    }
};

/**
 * @class
 */
IWEBAPP_.HTTPPathResolve = class {
    /**
     * @param {string} path
     */
    constructor(path) {
        this.value = path;
    }

    /**
     * @static
     * @param {string} path
     * @returns {IWEBAPP_.HTTPPathResolve}
     */
    static create(path) {
        return new IWEBAPP_.HTTPPathResolve(path);
    }

    /**
     * @returns {{ controller: string, method: string }}
     */
    path() {
        // Implementation here
    }

    /**
     * @static
     * @param {any} path
     * @returns {boolean}
     */
    static isValid(path) {
        // Implementation here
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.value;
    }
};

/**
 * @function
 * @param {IWEBAPP_.WebAppOptions} params
 * @returns {IWEBAPP_.WebApp}
 */
IWEBAPP_.create = function (params) {
    return new IWEBAPP_.WebApp(params);
};



