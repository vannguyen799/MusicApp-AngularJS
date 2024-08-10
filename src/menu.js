function onOpen() {
  const ui = SpreadsheetApp.getUi()

  ui.createMenu('AppsciptMenu')
    .addItem('process', process.name)
    .addItem('play', playSidebar.name)
    .addItem('openWeb', playWeb.name)
    .addToUi()
}


