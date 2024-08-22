WebApp.registerControllerPath({
  "": HomeController
})

WebApp.useService({
  htmlService: HtmlService,
  scriptApp: ScriptApp,
  propertyScope: PropertyScope
})

WebApp.templatePath(
  'src/view',
  'src/view/v2',
  'src/view/v1',
)

var JSONRPCServer = new WebApp.JSONRPCServer({
  'getAllSongAndId': getAllSongAndId,
  'getAllApiKey': getAllApiKey,
  'getAllSheetName': getAllSheetName,
  'setSongFavorite': setSongFavorite,
  'hello': function () {
    return { "hello": 'hello' }
  }
})


function doGet(e) {
  return WebApp.doGet(e)
}

function doPost(e) {
  // console.log(JSON.stringify(JSONRPCServer))
  // console.log(e)
  let postData = JSON.parse(e.postData.contents)
  if (postData.jsonrpc) {
    return JSONRPCServer.execute(postData)
  }
  // try {

  // } catch (err) {
  //   return WebApp.jsonResponse({ e: err, er_r: 'err' })
  // }
  // console.log(JSON.stringify(JSONRPCServer))
  return WebApp.doPost(e)
}

function getAllApiKey() {
  return driveApiKey
}

function getAllSongAndId(sheet) {
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
  return name.filter(n => !n.startsWith('_'))
}

function setSongFavorite(sheet, fileId, status) {
  let b = new SongFileManager(sheet)

  if (b.validateClass()) {
    return b.setSongFavorite(fileId, status)
  } return false
}