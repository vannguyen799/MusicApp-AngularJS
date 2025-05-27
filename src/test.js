function t() {
  let ss = JSONRPCServer.instance.verifyAuthToken('TFcwOUNhMHBkc3loQnQzcEJ1N0tOMDFmWG16d2VqMlhZWUkzTlFtNzVCWT06OmFkbWluOjow::1728286078574')
  console.log(ss)
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
      // b.trimText()
      b.fixRevision()
    }
  }
}

function testAddFavSong() {
  const fileId = extractFileId('https://drive.google.com/file/d/1-t-YjL6JoAGF8Du4tfp44x2NGmb_0EXM/view?usp=drivesdk')
  let b = new SongFileManager('LanXinYu')
  console.log(b.setSongFavorite(fileId)
  )
}

let res = []
let last = {}
for (const [index, el] of _qEsXpath('//div[contains(@class, "message_")]').entries()) {
    
    let name = _qEsXpath(_gXpath(el)  + '//span[contains(@id,"message-username-")]', el)[0]?.textContent || last.name;
        content = _qEsXpath(_gXpath(el)  + '//div[contains(@id,"message-content-")]', el)[0].textContent;
    last = { name, content }
    res.push(last)
}
return res