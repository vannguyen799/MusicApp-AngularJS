class MusicAppController extends WebApp.Controller {
  constructor() {
    super()
    // const post = WebApp.Method("POST")
  }
  /** @param {HTTPRequest} request */
  index(request) {
    let { mode, sheet, fileId } = request.parameter

    if (getAllSheetName().find(n => n == sheet)) {
      // try {
      //   if (sheet && sheet != '') {
      //     let manager = new SongFileManager(sheet)
      //     if (manager.validateClass()) {
      //       const row = manager.Sheet.getActiveCell().getRow()
      //       const linkUp = manager.Sheet.getRange(row, manager.linkUpColum.headerCell.col).getValue()
      //       var id = extractFileId(linkUp)
      //     }
      //   }
      // } catch (e) { sheet = '' }
    } else {
      if (!isDriveId(sheet)) {
        sheet = ''
      }
    }

    return AppServer.renderTemplate('audioPlayer', {
      title: 'Music App',
      sheet: sheet ?? '',
      fileId: isDriveId(fileId) ? fileId : '',
    })
  }
}