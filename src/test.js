function t() {
  // // console.log(globalThis)
  // let a = new HomeController()
  // console.log(a.getAllApiKey())
  // console.log(  ScriptApp.getIdentityToken().getUrl()
  // )
  let b = new SongFileManager('chinese')
  b.process({
    update: false
  })
  // b.addSong({
  //   songName: 's',
  //   singerName: 's',
  //   vsinger: 's'
  //   ,vname: ' s'
  //   ,linkUp:'ss'
  //   ,status:'s'
  // })
  // console.log(getAllSheetName())
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