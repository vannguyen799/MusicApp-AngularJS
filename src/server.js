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
  'setSongFavorite': WebApp.requireAuthToken(setSongFavorite),
  'getAllPlaylist': getAllPlaylist,
  'addPlaylist': addPlaylist,
  'removePlaylist': WebApp.requireAuthToken(removePlaylist),
  'updatePlaylist': WebApp.requireAuthToken(updatePlaylist),
  'auth': function auth(user) {
    return AuthService.instance.auth(user)
  },
  'addListens': addListens,
  'updateSong': WebApp.requireAuthToken(function (s) {
    return new SongFileManager(s.sheet).updateSong(s)
  }),
  verifyAuthToken: (token) => {
    return AuthService.instance.verifyAuthToken(token)
  },
  getAudio(fileid) {
    const file = DriveApp.getFileById(fileid)
    if (file.getMimeType().startsWith("audio/")) {
      return Utilities.base64Encode(file.getBlob().getBytes())
    }
    return false
  }
});

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
  if (sheet || sheet != '') {
    const manager = new SongFileManager(sheet)
    if (manager.validateClass()) { return manager.getAllSongs() } else { return [] }
  } else {
    let sheets = getAllSheetName()
    let res = []
    for (const sheet of sheets) {
      res = res.concat(getAllSongAndId(sheet))
    }
    return res
  }
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
function addPlaylist(playlist) {
  return PlaylistService.instance.createPlaylist(playlist)
}
function removePlaylist(id) {
  return PlaylistService.instance.removePlaylist(id)

}
function updatePlaylist(playlist) {
  return PlaylistService.instance.updatePlaylist(playlist)
}
function getAllPlaylist() {
  return PlaylistService.instance.getAllPlaylist()
}
function addListens(songInfo) {
  return new SongFileManager(songInfo.sheet).addListens(songInfo)
}

function simulateJSONRpcCall(method, params, authToken) {
  // ContentService.createTextOutput().getContent()
  let req = {
    contentLength: 1,
    'postData': {
      contents: JSON.stringify({ method, params, jsonrpc: '2.0', authToken })
    }
  }
  console.log(req.postData.contents)
  return JSON.parse(doPost(req).getContent())
}

