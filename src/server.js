var Web = new WebApp.AppsScriptWebApp()
var testUrl = 'https://script.google.com/macros/s/AKfycbw8Sepw517-HfqQSFAXO7cG3n39cRXpgHQf7D-DzvVw/dev'

WebApp.registerControllerPath({
  "": HomeController
})

function doGet(e) {
  return Web.doGet(e)
}

function doPost(e) {
  return ContentService.createTextOutput(JSON.stringify(e))
}


function getAllApiKey() {
  return driveApiKey
}

function getAllSongAndId(sheet) {
  console.log(sheet)
  const manager = new SongFileManager(sheet ?? SpreadsheetApp.getActiveSheet().getName())
  return manager.getAllSongs()
}
