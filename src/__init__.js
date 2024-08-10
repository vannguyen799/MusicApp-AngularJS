var PropertyScope = PropertiesService.getScriptProperties()

var properties = {
  ldrvkeyuse: 'ldrvkeyuse'
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