function t() {
  // // console.log(globalThis)
  // let a = new HomeController()
  // console.log(a.getAllApiKey())
  // console.log(  ScriptApp.getIdentityToken().getUrl()
  // )
  let b = new SongFileManager('vietnam')
  // b.process({
  //   update: true
  // })
  // b.addSong({
  //   songName: 's',
  //   singerName: 's',
  //   vsinger: 's'
  //   ,vname: ' s'
  //   ,linkUp:'ss'
  //   ,status:'s'
  // })
  console.log(getAllSheetName())
  return { a: 'a' }
}

function testFetchApi() {
  let resp = UrlFetchApp.fetch(ScriptApp.getService().getUrl() + '/getAllSongs')

  console.log(resp.getHeaders())
}

function t2() {
  console.log(ScriptApp.getOAuthToken())
}