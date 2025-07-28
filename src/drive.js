/**
 * get a folder by resolve path from rootFolderId or soundCollectionFolderId
 *
 * @param {string} path path to file or folder (folder name )
 * @param {string} rootFolderId root folder id
 * @returns {GoogleAppsScript.Drive.Folder}
 */
function getFolderFromPath(path, rootFolderId) {
    const folder = DriveApp.getFolderById(rootFolderId || soundCollectionFolderId);
    const parts = path.split("/");
    let currentFolder = folder;
    for (const part of parts) {
        currentFolder = currentFolder.getFolderByName(part);
    }

    return file;
}

function isValidDriveId(id) {
    return id.length == 33 && id.startsWith("1");
}

function getDriveServiceAccountOauth2() {
    const serviceAccount = ENV.SERVICE_ACCOUNT;
    return (
        OAuth2.createService("GoogleDrive:" + serviceAccount.client_email)
            // Set the endpoint URL.
            .setTokenUrl("https://oauth2.googleapis.com/token")

            // Set the private key and issuer.
            .setPrivateKey(serviceAccount.private_key)
            .setIssuer(serviceAccount.client_email)

            // Set the name of the user to impersonate. This will only work for
            // Google Apps for Work/EDU accounts whose admin has setup domain-wide
            // delegation:
            // https://developers.google.com/identity/protocols/OAuth2ServiceAccount#delegatingauthority
            .setSubject(serviceAccount.client_email)

            // Set the property store where authorized tokens should be persisted.
            .setPropertyStore(PropertiesService.getScriptProperties())

            // Set the scope. This must match one of the scopes configured during the
            // setup of domain-wide delegation.
            .setScope("https://www.googleapis.com/auth/drive.readonly") // <--- CHANGED SCOPE HERE
    );
}

// Example usage to get token and details
function testServiceAccountAccess() {
    const driveService = getDriveServiceAccountOauth2();

    if (driveService.hasAccess()) {
        Logger.log("Service account has access.");
        const token = driveService.getToken();
        const accessToken = token.access_token;

        const expiresIn = token.expiresAt;

        Logger.log("Access Token: " + accessToken);
        Logger.log("Expires In (seconds): " + expiresIn);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        Logger.log("Approximate Expiration Date: " + expirationDate.toLocaleString());

        // Make sure Google Drive API service is enabled in your Apps Script project
        // (In Apps Script editor: Services -> Add service -> Search for "Drive API")
        try {
            // List files owned by the impersonated user (if set) or the service account itself
            const files = Drive.Files.list({ maxResults: 5 });
            Logger.log("Files found via service account: " + files.items.length);
            files.items.forEach((file) => Logger.log("- " + file.title));
        } catch (e) {
            Logger.log("Error listing files with service account: " + e.message);
            Logger.log("Error stack: " + e.stack);
        }
    } else {
        Logger.log("Service account failed to get access.");
        Logger.log("Last Error: " + driveService.getLastError());
    }
}
