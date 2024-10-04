WebApp.registerControllerPath({
  "": MusicAppController
})
WebApp.useService({
  htmlService: HtmlService,
  scriptApp: ScriptApp,
  propertyScope: PropertyScope
})
WebApp.templatePath(
  'src/view'
)

function doGet(e) {
  return WebApp.doGet(e)
}

function doPost(e) {
  // console.log(JSON.stringify(JSONRPCServer))
  // console.log(e)
  let postData = JSON.parse(e.postData.contents)
  if (postData.jsonrpc) {
    return JSONRPCServer.instance.execute(postData)
  }

  return WebApp.doPost(e)
}

function simulateJSONRpcCall(method, params, authToken) {
  let req = genRPCrequest_(method, params, authToken)
  console.log(req.postData.contents)
  const r = JSON.parse(doPost(req).getContent())
  console.log(r)
  return r
}

function genRPCrequest_(method, params, authToken) {
  return {
    contentLength: 1,
    postData: {
      contents: JSON.stringify({ method, params, jsonrpc: '2.0', authToken })
    }
  }
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