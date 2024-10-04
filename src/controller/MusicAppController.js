/** @extends {IController} */
class MusicAppController extends WebApp.Controller {
  constructor() {
    super()
    // const post = WebApp.Method("POST")
  }
  /** @param {HTTPRequest} request */
  index(request) {
    let { mode, sheet } = request.parameter

    if (getAllSheetName().find(n => n == sheet)) {
      try {
        if (sheet && sheet != '') {
          let manager = new SongFileManager(sheet)
          if (manager.validateClass()) {
            const row = manager.Sheet.getActiveCell().getRow()
            const linkUp = manager.Sheet.getRange(row, manager.linkUpColum.headerCell.col).getValue()
            var id = extractFileId(linkUp)
          }
        }
      } catch (e) { sheet = '' }
    } else {
      if (!isDriveId(sheet)) {
        sheet = ''
      }
    }

    // return WebApp.renderTemplate(mode != 'dev' ? 'audioPlayer' : 'apDev', {
    return WebApp.renderTemplate('audioPlayer', {
      title: 'Music App',
      fileId: id == null ? '' : id,
      sheet: sheet ?? '',
      // host: ScriptApp.getService().getUrl(),
      // parameter: request.parameter
      // token: ScriptApp.getOAuthToken()
    })
  }
}