function t() {
  // let key = AuthService.generateAuthToken('admin')
  // console.log(AuthService.verifyAuthToken(key))
  // let s = { "sheet": "Chinese", "fileId": "15YxaZMii_JPhM4mXRX9xd2cHE4D93Hda", "lyric": "", "singer": "王恰恰", "lyric_vn": "", "$$hashKey": "object:182", "vsinger": "Vương Kháp Kháp", "listens": 1, "name": "求佛", "isFavorite": false, "vname": "Cầu phật" }
  // // console.log(simulateJSONRpcCall('updateSong', [s], 'yAJHx60yXnEHDob/zaU/NmZlpAQUKz0aBjUMS55oits=::admin::1725301736397'))
  // console.log(new SongFileManager(s.sheet).updateSong(s))
  // // console.log(globalThis)
  // let a = new HomeController()
  // console.log(a.getAllApiKey())
  // console.log(  ScriptApp.getIdentityToken().getUrl()
  // )
  // let b = new SongFileManager('chinese')
  // b.process({
  //   update: false
  // })
  // b.addSong({
  //   songName: 's',
  //   singerName: 's',
  //   vsinger: 's'
  //   ,vname: ' s'
  //   ,linkUp:'ss'
  //   ,status:'s'
  // })
  // console.log(getAllSheetName())
  // Logger.log(PlaylistService.instance.file.getUrl()
  // )
  // let method = getAllApiKey.name
  // let params = []
  // let exreq = {
  //   contentLength: 1,
  //   'postData': {
  //     contents: JSON.stringify({ method, params, jsonrpc: '2.0' })
  //   }
  // }
  // console.log(doPost(exreq).getContent())
  // return folder = file.getParents().next();
  console.log(lyricFrom('https://www.kugeci.com/song/AnhlMmwk'))
  return { a: 'a' }
}



function testFetchApi() {
  let resp = UrlFetchApp.fetch(ScriptApp.getService().getUrl() + '/getAllSongs')

  console.log(resp.getHeaders())
}

function t2() {
  // console.log(ScriptApp.getOAuthToken())
  //   let a = SpreadsheetApp.getActiveSheet().getRange('a33')
  //   console.log(  a.getFormula() === ''
  // )
  //   console.log(a.getValue())

  for (const name of getAllSheetName()) {
    let b = new SongFileManager(name)
    if (b.validateClass()) {
      b.trimText()
    }
  }

}

function testAddFavSong() {
  const fileId = extractFileId('https://drive.google.com/file/d/1-t-YjL6JoAGF8Du4tfp44x2NGmb_0EXM/view?usp=drivesdk')
  let b = new SongFileManager('LanXinYu')
  console.log(b.setSongFavorite(fileId)
  )
}