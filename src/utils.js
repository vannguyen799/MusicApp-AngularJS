function extractFileId(url) {
  try {
    const match = url.match(/\/d\/(.+?)\//);
    if (match && match[1]) {
      return match[1];
    }
  } catch (e) {
    return null
  }
  return null
}


function selectDriveAPIKey() {
  let i = PropertyScope.getProperty(properties.ldrvkeyuse)
  if (i == null || i == '' || parseInt(i) >= driveApiKey.length) {
    i = 0
  } else {
    i = parseInt(i) + 1
  }
  PropertyScope.setProperty(properties.ldrvkeyuse, i.toString())
  return driveApiKey[i] ?? driveApiKey[0]
}


