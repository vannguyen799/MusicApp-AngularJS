

/** @type {IWEBAPP_.WebApp} */
var AppServer = WebApp.create({
  htmlService: HtmlService,
  scriptApp: ScriptApp,
  propertyScope: PropertyScope
})


AppServer.registerControllerPath({
  "": MusicAppController
})
AppServer.templatePath(
  'src/view'
)

function doGet(e) {
  return AppServer.doGet(e)
}

function doPost(e) {
  console.log(e)
  return JSONRPCServer.instance.doPost(e) || AppServer.doPost(e)
}

function simulateJSONRpcCall(method, params, authToken) {
  console.log({
    method, params, authToken, jsonrpc: '2.0'
  })
  const res = JSONRPCServer.instance.execute({
    method, params, authToken, jsonrpc: '2.0'
  })
  console.log(res)
  return res
}

/** @param {string} sheet  @returns {any[]} */
function getAllSongAndId(sheet) {
  if (sheet && sheet != '') {
    // console.log(sheet)
    const manager = new SongFileManager(sheet)
    if (manager.validateClass()) { return manager.getAllSongs() } else { return [] }
  } else {
    let sheets = getAllSheetName()
    let res = []
    for (const sheet of sheets) {
      res = res.concat(getAllSongAndId(sheet))
    }
    return res.filter(r => { delete r.id; return r.status != 'danger' })
  }
}

function getAllSheetName() {
  let name = []
  for (const sheet of SpreadsheetApp.getActiveSpreadsheet().getSheets()) {
    name.push(sheet.getName())
  }
  return name.filter(n => !n.startsWith('_'))
}

function updateSongDb() {
  const songs = getAllSongAndId()
  console.log('all song get sheet')
  // RETURN _ID LIST
  console.log('updating')
  SongService.instance.updateAllSongs(songs)
  console.log('all song ypdate db', songs.length)
}

