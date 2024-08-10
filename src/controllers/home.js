class HomeController extends WebApp.Controller {
  // constructor() { super()}
  index(request) {
    const { mode, sheet } = request.parameter

    let manager = new SongFileManager(sheet ?? SpreadsheetApp.getActiveSheet().getName())
    if (manager.validateClass()) {
      const row = manager.Sheet.getActiveCell().getRow()
      const linkUp = manager.Sheet.getRange(row, manager.linkUpColum.headerCell.col).getValue()
      var id = extractFileId(linkUp)
    }

    return WebApp.renderTemplate(HtmlService.createTemplateFromFile(mode != 'dev' ? 'view/audioPlayer' : 'view/apDev'), {
      fileId: id == null ? '' : id,
      sheet: manager.Sheet.getName()
    })
  }

  getAllApiKey() {
    return driveApiKey
  }

  getAllSongAndId(sheet) {
    console.log(sheet)
    const manager = new SongFileManager(sheet ?? SpreadsheetApp.getActiveSheet().getName())
    return manager.getAllSongs()
  }

}