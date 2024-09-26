var testUrl = 'https://script.google.com/macros/s/AKfycbw8Sepw517-HfqQSFAXO7cG3n39cRXpgHQf7D-DzvVw/dev'
var lanxinYU = "https://script.google.com/macros/s/AKfycbw8Sepw517-HfqQSFAXO7cG3n39cRXpgHQf7D-DzvVw/dev?sheet=LanXinyu"
var testDevUrl = 'https://script.google.com/macros/s/AKfycbw8Sepw517-HfqQSFAXO7cG3n39cRXpgHQf7D-DzvVw/dev?mode=dev'
var executions = 'https://script.google.com/u/0/home/projects/1L6ZG92DR-p3c9NkCAFTBku6X4yfTDQqHHRpxzqKW9OKhTU4wcEDT4ymU/executions'
var _sheet_ = 'https://docs.google.com/spreadsheets/d/1cCdjDAcSi1VIxYVY8Qiab5DVvy69m9wjBRl8DSCQgcw/edit?gid=643801577#gid=643801577'

var PropertyScope = PropertiesService.getScriptProperties()

var properties = {
  ldrvkeyuse: 'ldrvkeyuse'
}


function onOpen() {
  const ui = SpreadsheetApp.getUi()

  ui.createMenu('AppsciptMenu')
    .addItem('process', process.name)
    // .addItem('play', playSidebar.name)
    .addItem('openWeb', playWeb.name)
    .addItem('db push', updateSongDb.name)
    .addToUi()
}

function process() {
  let manager = new SongFileManager(SpreadsheetApp.getActiveSheet().getName())
  if (manager.validateClass()) {
    manager.process({ update: true })
  }
}

function playSidebar() {
  return SpreadsheetApp.getUi().showSidebar(
    new MusicAppController().index({
      parameter: { mode: 'dev' }

    })
  )
}

function playWeb() {

  return SpreadsheetApp.getUi().showModalDialog(WebApp.renderTemplate('newTab', {
    url: `${testUrl}&sheet=${SpreadsheetApp.getActiveSheet().getName()}`
  }), 'playWeb')
}
