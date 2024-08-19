/** @extends {ISheetManager} */
class SongFileManager extends SM.Sheet.SheetManager {
  constructor(sheetName, folderId, mode) {
    super(sheetName)
    this.folderId = folderId != undefined ? folderId : this.Sheet.getRange('B1').getValue()
    if (sheetName == 'vietnam') {
      this.originalNameOnly = true
    }
    if (this.folderId.length != 33) {
      throw new Error(' invalid folderId: got ' + this.folderId)
    }
    this.folder = DriveApp.getFolderById(this.folderId)

    this.tableHeader = {
      songName: 'name',
      singerName: 'singer',
      linkUp: 'link up',
      status: 'status',
      filename: 'filename',
      vname: 'vname',
      vsigner: 'vsigner'
    }
    this.ignoreFile = [SpreadsheetApp.getActiveSpreadsheet().getName()]
  }

  validateClass() {
    return this.forderId != ''
  }
  get songNameColumn() {
    return this.getColumn(this.tableHeader.songName, null, false)
  }
  get singerNameColumn() {
    return this.getColumn(this.tableHeader.singerName, null, false)
  }
  get processFileNameColumn() {
    return this.getColumn(this.tableHeader.filename, null, false)
  }
  get statusColumn() {
    return this.getColumn(this.tableHeader.status, null, false)
  }
  get linkUpColum() {
    return this.getColumn(this.tableHeader.linkUp, null, false)
  }
  get vnameColumn() {
    return this.getColumn(this.tableHeader.vname, null, false)
  }
  get vsingerColumn() {
    return this.getColumn(this.tableHeader.vsigner, null, false)
  }
  process({ update }) {
    console.log('processing...')
    let filesIterator = this.folder.getFiles()

    while (filesIterator.hasNext()) {
      let isProcessed = false
      let row = undefined
      let file = filesIterator.next()
      if (!this.ignoreFile.includes(file.getName())) {
        //process
        let fileName = file.getName()
        let [_singer, _songName] = ['', fileName]
        let [_vsinger, _vname] = ['', '']

        console.log('check ' + fileName)

        let songNames = this.songNameColumn.getData()
        let singerNames = this.singerNameColumn.getData()
        if (!this.isNameProcessed(fileName)) {
          [_singer, _songName] = this.getSongInfoFromPreName(fileName);
          for (const i in songNames) {
            if (songNames[i].trim() == _songName && singerNames[i].trim() == _singer) {
              let newName = this.processFileNameColumn.getData(i)
              if (newName && newName != '' && newName != null && newName != ' -  |  - ') {
                file.setName(newName)
              }
              isProcessed = true
              row = i
              break
            }
          }
        } else {
          // changeName
          // console.log(fileName)

          [_singer, _songName, _vsinger, _vname] = this.getSongInfoFromProcessedName(fileName);
          // _singer = _singer.replace(',', '，')
          console.log(_songName)

          for (const i in songNames) {
            if (songNames[i].trim() == _songName && singerNames[i].trim() == _singer) {
              let newName = this.processFileNameColumn.getData(i)
              if (newName && newName != '' && newName != null && newName != ' -  |  - ' && newName != fileName) {
                file.setName(newName)
              }
              row = i
              isProcessed = true
              break
            }
          }
        }

        if (!isProcessed) {
          console.log(`file unprocessed: ${file.getName()}`)
          if (update) {
            console.log('updatinng  ' + update)
            this.addSong({
              songName: _songName,
              singerName: _singer,
              vsinger: _vsinger,
              vname: _vname,
              linkUp: file.getUrl(),
              status: 'unprocess'
            })
          }
        } else {
          row = parseInt(row) + 1
          if (row > 0) {
            this.Sheet.getRange(row + this.statusColumn.headerCell.row, this.statusColumn.headerCell.col).setValue('ok')
            this.Sheet.getRange(row + this.linkUpColum.headerCell.row, this.linkUpColum.headerCell.col).setValue(file.getUrl())
          } else {
            this.Sheet.getRange(row + this.statusColumn.headerCell.row, this.statusColumn.headerCell.col).setValue('')
          }
        }
      }
    }
  }
  addSong({ songName, singerName, vname, vsinger, linkUp, status }) {
    const songNameCol = this.songNameColumn
    let row = undefined
    for (let i = songNameCol.cells.length - 1; i >= 0; i--) {
      if (songNameCol.getData(i) != '') {
        row = songNameCol.cells[i].row + 1
        break
      }
    }
    if (!row) {
      row = songNameCol.headerCell.row + 1
    }

    if (row) {
      console.log(row)

      this.Sheet.getRange(row, songNameCol.headerCell.col).setValue(songName)
      // set singerName
      this.Sheet.getRange(row, this.singerNameColumn.headerCell.col).setValue(singerName)
      // set status
      this.Sheet.getRange(row, this.statusColumn.headerCell.col).setValue(status ?? 'unprocess')
      this.Sheet.getRange(row, this.vnameColumn.headerCell.col).setValue(vname)
      this.Sheet.getRange(row, this.vsingerColumn.headerCell.col).setValue(vsinger)
      this.Sheet.getRange(row, this.linkUpColum.headerCell.col).setValue(linkUp)

      this.flush()
    }
  }
  /**
   * 
   * @param {string} name 
   * @returns 
   */
  isNameProcessed(name) {
    if (this.originalNameOnly) {
      return name.includes('-')
    } else {
      return name.includes(' | ') && name.includes('-')
    }
  }

  getSongInfoFromPreName(preName) {
    preName = preName.split('.flac')[0].split('.mp3')[0]

    function test(p, s) {
      if (s.includes(p)) {
        return s.split('.')[0].split(p)
      }
    }
    return test(' - ', preName) || test('+-+', preName) || [preName, '']
  }

  /** @param {string} processedName 
   * @return {[string, string, string, string]}
  */
  getSongInfoFromProcessedName(processedName) {

    let [_vname, _vsinger, _name, _signer] = ['', '', '', '']
    processedName = processedName.split('.flac')[0].split('.mp3')[0]
    if (this.originalNameOnly) {
      processedName = processedName.replace('-  |', '')
      _signer = processedName.split('-')[0].trim()
      _name = processedName.split('-')[1].trim()
    } else {
      _vsinger = processedName.split('|')[0].split('-')[0].trim()
      _vname = processedName.split('|')[0].split('-')[1].trim()
      _signer = processedName.split('|')[1].split('-')[0].trim()
      _name = processedName.split('|')[1].split('-')[1].trim()
    }

    return [_signer, _name, _vsinger, _vname]
  }
  getAllSongs() {
    const vnames = this.vnameColumn.getData()
    const vsingers = this.vsingerColumn.getData()
    const linkUp = this.linkUpColum.getData()
    const names = this.songNameColumn.getData()
    const singers = this.singerNameColumn.getData()
    let rs = []
    for (const i in vnames) {
      /** @type {SongInfo} */
      let s = {
        name: names[i],
        singer: singers[i],
        fileId: extractFileId(linkUp[i]),
        vname: vnames[i],
        vsinger: vsingers[i]
      }
      if (s.fileId != null) {
        rs.push(s)
      }
    }
    return rs
  }


}


class SongInfo {
  constructor() {
    this.vname = ''
    this.name = ''
    this.singer = ''
    this.vsigner = ''
    this.linkUp = ''
    this.fileId = ''
    this.filename = ''
  }
}
