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

var JSONRPCServer = new WebApp.JSONRPCServer({
  getAllApiKey() {
    return secrect_.driveApiKey
  },
  getSongs(sheetName) {
    return SongService.instance.getSongs(sheetName)
  },
  'getAllSheetName': getAllSheetName,
  'getPlaylist': WebApp.requireAuthToken(function (session) {
    return PlaylistService.instance.getPlaylist(session.user)
  }),
  'addPlaylist': WebApp.requireAuthToken(function (playlist, session) {
    return PlaylistService.instance.addPlaylist(session.user, playlist)
  }),
  'removePlaylist': WebApp.requireAuthToken(function (playlist, session) {
    return PlaylistService.instance.removePlaylist(session.user, playlist)
  }),
  'updatePlaylist': WebApp.requireAuthToken(function (playlist, session) {
    return PlaylistService.instance.updatePlaylist(session.user, playlist)
  }),
  'getUserInfo': WebApp.requireAuthToken(function (session) {
    return UsersService.instance.getUser(session.user)
  }),
  login(user) {
    return AuthService.instance.login(user)
  },
  register(user) {
    return AuthService.instance.register(user)
  },
  'setFavoriteSong': WebApp.requireAuthToken(function (fileIds, session) {
    return UsersService.instance.addFavorite(session.user, fileIds)
  }),
  'rmvFavoriteSong': WebApp.requireAuthToken(function (fileIds, session) {
    return UsersService.instance.rmvFavorite(session.user, fileIds)
  }),
  addListens(song) {
    return SongService.instance.addListens(song)
  },
  'updateSong': WebApp.requireAuthToken(function (s) {
    return SongService.instance.updateSong(s)
  }),
  verifyAuthToken(token) {
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

  return WebApp.doPost(e)
}

function simulateJSONRpcCall(method, params, authToken) {
  let req = {
    contentLength: 1,
    'postData': {
      contents: JSON.stringify({ method, params, jsonrpc: '2.0', authToken })
    }
  }
  console.log(req.postData.contents)
  const r = JSON.parse(doPost(req).getContent())
  console.log(r)
  return r
}

/** @param {string} sheet  @returns {any[]} */
function getAllSongAndId(sheet) {
  if (sheet && sheet != '') {
    console.log(sheet)
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



