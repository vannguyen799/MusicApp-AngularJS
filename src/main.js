function process() {
  let manager = new SongFileManager(SpreadsheetApp.getActiveSheet().getName())
  if (manager.validateClass()) {
    manager.process()
  }
}

function playSidebar() {
  return SpreadsheetApp.getUi().showSidebar(audioPlayerRender())
}

function playWeb() {
  let htmlOutput = HtmlService.createTemplateFromFile('view/newTab')
  htmlOutput.url = 'https://script.google.com/macros/s/AKfycbw8Sepw517-HfqQSFAXO7cG3n39cRXpgHQf7D-DzvVw/dev'
  return SpreadsheetApp.getUi().showModalDialog(htmlOutput.evaluate(), 'playWeb')
}

