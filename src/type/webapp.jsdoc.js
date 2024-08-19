/**
 * Enum for HTTP methods.
 * @enum {string}
 */
const HTTPMethod = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
};

/**
 * @typedef {GoogleAppsScript.HTML.HtmlOutput | HtmlService.HtmlOutput} HtmlOutput
 */

/**
 * @typedef {GoogleAppsScript.Content.TextOutput | ContentService.TextOutput} TextResponse
 */

/**
 * @typedef {(HtmlOutput | TextResponse)} HTTPResponse
 */

/**
 * @typedef {`${string & { __brand: string }}`} RegexMatchedString
 */

/**
 * @typedef {RegexMatchedString<"/^/?[a-zA-Z0-9-/]*$/">} HTTPPath
 */

/**
 * @typedef {Object} HTTPInput
 * @property {string} queryString - The query string part of the URL, or null if no query string is specified.
 * @property {Object} parameter - Object of key/value pairs corresponding to request parameters. Only the first value is returned for parameters with multiple values.
 * @property {Object} parameters - Similar to `parameter`, but has an array of values for each key.
 * @property {string} pathInfo - The URL path after /exec or /dev. For example, if the URL path ends with /exec/hello, the path info is "hello".
 * @property {string} contextPath - Not used, always an empty string.
 * @property {number} contentLength - The content length of the request for POST requests, or -1 for GET requests.
 * @property {Object} postData - The post data object.
 * @property {number} postData.length - Same as `contentLength`.
 * @property {string} postData.type - The MIME type of the post content.
 * @property {string} postData.contents - The text content of the POST request body.
 * @property {string} postData.name - Always the value "postData".
 */

/**
 * Class representing a controller.
 * @class
 */
class IController {
    constructor() {
      /**
     * @type {string}
     */
    this.defaultPath;
    }

    /**
     * Handles the index request.
     * @param {HTTPRequest} request
     * @returns {HTTPResponse}
     */
    index(request) {}

    /**
     * Executes the given method and path with the provided parameters and data.
     * @param {HTTPMethod} [method]
     * @param {string} [path]
     * @param {HTTPInput} [e]
     * @returns {HTTPResponse}
     */
    execute(method, path, e) {}

    /**
     * Handles 404 errors.
     * @param {HTTPRequest} request
     * @returns {HTTPResponse}
     */
    error404(request) {}

    /**
     * Redirects to the given path.
     * @param {string} path
     * @returns {any}
     */
    redirect(path) {}

    /**
     * Retrieves all methods for the given HTTP method.
     * @param {HTTPMethod} method
     * @returns {ControllerMethod[]}
     */
    allMethod(method) {}
}

/**
 * @typedef {Object} HTTPRequest
 * @property {HTTPMethod} [method]
 * @property {Object} [parameter]
 * @property {HTTPInput["postData"]} [data]
 * @property {HTTPInput} [httpInput]
 */

/**
 * @typedef {Object} ControllerMethod
 * @property {string} path
 * @property {(request?: HTTPRequest) => HTTPResponse} execute
 * @property {HTTPMethod | HTTPMethod[]} allowedMethods
 */
