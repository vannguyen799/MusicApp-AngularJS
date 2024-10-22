'use strict'
/** @type {IWebApp.WebApp} */
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
  const sheetNames = getAllSheetName()
  const requests = []
  const token = AuthService.instance.generateAuthToken({ username: 'admin', role: '0' })
  for (const name of sheetNames) {
    requests.push({
      ...JSONRPCServer.instance.genRPCRequest('admin_dbSingleSheetPush', [name], token),
      url: 'https://script.google.com/macros/s/AKfycbz1FHLLdtpW5hba-4NlD0l-tqqBpdZ4EbvYuRAC2GfTU5g_RR6pHgti3trJ0nWkwoVOFA/exec'
      // ScriptApp.getService().getUrl()
    })
  }
  // console.log(requests)
  const ress = UrlFetchApp.fetchAll(requests)
  // console.log(JSON.stringify(ress.map(r => r.getContentText())))
  return ress
}

