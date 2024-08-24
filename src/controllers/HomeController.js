
/** @extends {IController} */
class HomeController extends WebApp.Controller {
  constructor() {
    super()
    const post = WebApp.Method("POST")
    post(HomeController.prototype.setSongFavorite)
    // post(HomeController.prototype.getAllApiKey)
    // post(HomeController.prototype.getAllSongs)
  }
  /**
     * @param {HTTPRequest} request
     */
  index(request) {
    const { mode, sheet } = request.parameter

    let manager = new SongFileManager(sheet ?? SpreadsheetApp.getActiveSheet().getName())
    if (manager.validateClass()) {
      const row = manager.Sheet.getActiveCell().getRow()
      const linkUp = manager.Sheet.getRange(row, manager.linkUpColum.headerCell.col).getValue()
      var id = extractFileId(linkUp)
    }

    return WebApp.renderTemplate(mode != 'dev' ? 'audioPlayer' : 'apDev', {
      title: 'MusicApp',
      fileId: id == null ? '' : id,
      sheet: manager.Sheet.getName(),
      host: ScriptApp.getService().getUrl(),
      parameter: request.parameter
      // token: ScriptApp.getOAuthToken()
    })
  }

  // /**
  //  * @param {HTTPRequest} request
  //  */
  // getAllApiKey(request) {
  //   return WebApp.jsonResponse(driveApiKey)
  // }
  // /**
  //  * @param {HTTPRequest} request
  //  */
  // getAllSongs(request) {
  //   const manager = new SongFileManager(request.parameter.sheet ?? SpreadsheetApp.getActiveSheet().getName())
  //   return WebApp.jsonResponse(manager.getAllSongs())
  // }

  setSongFavorite(sheet, fileId, status) {
    return setSongFavorite(sheet, fileId, status)
  }
  getAllSongAndId(sheet) { getAllSongAndId(sheet) }

  getAllSheetName() { return getAllSheetName() }
}