WebApp.registerControllerPath({
  "": HomeController
})

WebApp.useService({
  htmlService: HtmlService,
  scriptApp: ScriptApp,
  propertyScope: PropertiesService.getScriptProperties()
})

WebApp.templatePath(
  'src/view',
  'src/view/v2',
  'src/view/v1',

)

function doGet(e) {
  return WebApp.doGet(e)
}

function doPost(e) {
  return WebApp.doPost(e)
}

function getAllApiKey() {
  return driveApiKey
}

function getAllSongAndId(sheet) {
  console.log(sheet)
  sheet = sheet.replace('"', '').replace('"', '')

  const manager = new SongFileManager(sheet ?? SpreadsheetApp.getActiveSheet().getName())
  return manager.getAllSongs()
}

function getAllSheetName() {
  let name = []
  for (const sheet of SpreadsheetApp.getActiveSpreadsheet().getSheets()) {
    // try {
    //   let name_ = sheet.getName()
    //   if (new SongFileManager(name_).validateClass()) {
    //     name.push(name_)
    //     console.log(name_)
    //   }
    // } catch (e) {

    // }
    name.push(sheet.getName())
  }
  return name.filter(n => !['singer'].includes(n))
}