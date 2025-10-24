var soundCollectioFolderId = "1UXR4Khyzz8zvTK9cRmFerJBfnRU8rzZ9";

var ENV = {
    /** @type {string} */
    SOUND_COLLECTION_FOLDER_ID: secrect_.soundCollectionFolderId,
    /** @type {ServiceAccount} */
    SERVICE_ACCOUNT: secrect_.serviceAccount,
    /** @type {OAuth2Client} */
    OAUTH20_CLIENT: secrect_.oauth20client,
    /** @type {string[]} */
    DRIVE_API_KEY: secrect_.driveApiKey,
    /** @type {string} */
    SPREADSHEET_ID: secrect_.spreadsheetId,
};
/**
 * @typedef {Object} ServiceAccount
 * @property {string} type - The type of credential (should be "service_account")
 * @property {string} project_id - Google Cloud project ID
 * @property {string} private_key_id - The ID of the private key
 * @property {string} private_key - The actual private key in PEM format
 * @property {string} client_email - The email address of the service account
 * @property {string} client_id - The client ID of the service account
 * @property {string} auth_uri - The authentication URI
 * @property {string} token_uri - The token URI for OAuth2
 * @property {string} auth_provider_x509_cert_url - URL for the provider's X.509 certs
 * @property {string} client_x509_cert_url - URL to the client's X.509 cert
 * @property {string} universe_domain - Google APIs domain (usually "googleapis.com")
 */

/**
 * @typedef {Object} OAuth2ClientWeb
 * @property {string} client_id - OAuth2 client ID
 * @property {string} client_secret - OAuth2 client secret
 * @property {string[]} redirect_uris - List of authorized redirect URIs
 * @property {string} auth_uri - Authorization endpoint URI
 * @property {string} token_uri - Token endpoint URI
 * @property {string} auth_provider_x509_cert_url - URL to the auth provider's X.509 certificates
 * @property {string} client_x509_cert_url - URL to the client’s X.509 certificate
 * @property {string} issuer - The issuer URI (e.g., https://accounts.google.com)
 * @property {string} jwks_uri - URL for JSON Web Key Set used for verifying tokens
 */

/**
 * @typedef {Object} OAuth2Client
 * @property {OAuth2ClientWeb} web - Configuration for web-based OAuth2 flow
 */
