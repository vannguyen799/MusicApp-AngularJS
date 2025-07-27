/**
 * get a folder by resolve path from soundCollectionFolderId
 *
 * @param {string} path path to file or folder (folder name )
 * @returns {GoogleAppsScript.Drive.Folder}
 */
function getFolderFromPath(path) {
    const folder = DriveApp.getFolderById(soundCollectionFolderId);
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
