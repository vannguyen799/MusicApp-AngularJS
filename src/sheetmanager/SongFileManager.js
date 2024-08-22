/** @extends {ISheetManager} */
class SongFileManager extends SM.Sheet.SheetManager {
  constructor(sheetName, folderId, mode) {
    super(sheetName)
    this.sheetName = sheetName
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
      vsigner: 'vsigner',
      isFavorite: 'isFavorite'
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
  get isFavoriteColumn() {
    return this.getColumn(this.tableHeader.isFavorite, null, false)
  }

  /**
 * @typedef {Object} SongInfo
 * @property {string} vname - The virtual name of the song.
 * @property {string} name - The name of the song.
 * @property {string} singer - The name of the singer.
 * @property {string} vsigner - The virtual name of the singer.
 * @property {string} linkUp - The link to the song.
 * @property {string} fileId - The ID of the file.
 * @property {string} filename - The name of the file.
 * @property {boolean} isFavorite
 */

  process({ update }) {
    console.log('processing... ')
    console.log(update)

    const filesIterator = this.folder.getFiles()
    const songNames = this.songNameColumn.getData()
    const singerNames = this.singerNameColumn.getData()
    const vsongNames = this.vnameColumn.getData()
    const vsingerNames = this.vsingerColumn.getData()

    // const processFilename = this.processFileNameColumn.getData()
    while (filesIterator.hasNext()) {
      let isProcessed = false
      let row = undefined
      let file = filesIterator.next()
      if (!this.ignoreFile.includes(file.getName())) {
        //process
        let fileName = file.getName()
        let _singer, _songName, _vsinger, _vname;

        console.log('check ' + fileName)


        let formatedName = fileName

        if (!this.isNameProcessed(fileName)) {
          [_singer, _songName] = this.getSongInfoFromPreName(fileName);
          for (const i in songNames) {
            if (songNames[i].trim() == _songName && singerNames[i].trim() == _singer) {
              if (this.originalNameOnly) {
                formatedName = `${singerNames[i]} - ${songNames[i]}`
              } else {
                formatedName = `${vsingerNames[i]} - ${vsongNames[i]} | ${singerNames[i]} - ${songNames[i]}`
              }
              if (formatedName && formatedName != '' && formatedName != null && formatedName != ' -  |  - ') {
                file.setName(formatedName)
              }
              isProcessed = true // ?? is needed
              row = i
              break
            }
          }
        } else {
          // changeName

          [_singer, _songName, _vsinger, _vname] = this.getSongInfoFromProcessedName(fileName);

          for (const i in songNames) {
            if (songNames[i].trim() == _songName && singerNames[i].trim() == _singer) {
              if (this.originalNameOnly) {
                formatedName = `${singerNames[i]} - ${songNames[i]}`
              } else {
                formatedName = `${vsingerNames[i]} - ${vsongNames[i]} | ${singerNames[i]} - ${songNames[i]}`
              }

              if (formatedName && formatedName != '' && formatedName != null && formatedName != ' -  |  - ' && formatedName != fileName) {
                file.setName(formatedName)
              }
              row = i
              isProcessed = true // ?? is needed
              break
            }
          }
        }

        if (!isProcessed) {
          console.log(`file unprocessed: ${file.getName()}`)
          if (update) {
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
    const songNames = songNameCol.getData()
    let row = undefined
    for (let i = songNameCol.cells.length - 1; i >= 0; i--) {
      if (songNames[i] != '') {
        row = songNameCol.cells[i].row + 1
        break
      }
    }
    if (!row) {
      row = songNameCol.headerCell.row + 1
    }

    if (row) {
      // console.log(row)

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
      return name.includes(' - ')
    } else {
      return name.includes(' | ') && name.includes(' - ')
    }
  }

  /**
   * 
   * @param {string} _preName 
   * @returns {[string, string]}
   */
  getSongInfoFromPreName(preName) {
    let _preName = this.removeExt(preName)


    /**
     * @param {*} p 
     * @param {*} s 
     * @returns {string[]}
     */
    function test(p, s) {
      if (s.includes(p)) {
        return s.split(p)
      }
      return undefined
    }
    let res = test('+-+', _preName)
    if (!res) {
      if (_preName.indexOf('-') == _preName.lastIndexOf('-')) {
        res = test('-', _preName)
      }
    }
    res = res ?? [_preName, '']

    return res.map(m => m.replace('+', ' ').trim())
  }

  removeExt(fileName) {
    const fileExt = ['flac', 'wav', 'mp3', 'ape', 'm4a']

    for (const ext of fileExt) {
      fileName = fileName.split(`.${ext}`)[0]
    }
    return fileName
  }
  /** @param {string} processedName 
   * @return {[string, string, string, string]}
  */
  getSongInfoFromProcessedName(processedName) {
    processedName = this.removeExt(processedName)
    let [_vname, _vsinger, _name, _signer] = ['', '', '', '']
    if (this.originalNameOnly) {
      processedName = processedName.replace('-  |', '')
      _signer = processedName.split(' - ')[0].trim()
      _name = processedName.split(' - ')[1].trim()
    } else {
      _vsinger = processedName.split('|')[0].split(' - ')[0].trim()
      _vname = processedName.split('|')[0].split(' - ')[1].trim()
      _signer = processedName.split('|')[1].split(' - ')[0].trim()
      _name = processedName.split('|')[1].split(' - ')[1].trim()
    }

    return [_signer, _name, _vsinger, _vname]
  }
  getAllSongs() {
    const vnames = this.vnameColumn.getData()
    const vsingers = this.vsingerColumn.getData()
    const linkUp = this.linkUpColum.getData()
    const names = this.songNameColumn.getData()
    const singers = this.singerNameColumn.getData()
    const isFav = this.isFavoriteColumn.getData()
    let rs = []
    for (const i in vnames) {
      /** @type {SongInfo} */
      let s = {
        name: names[i],
        singer: singers[i],
        fileId: extractFileId(linkUp[i]),
        vname: vnames[i],
        vsinger: vsingers[i],
        isFavorite: isFav[i] != '',
        sheet: this.sheetName
      }
      if (s.fileId != null) {
        rs.push(s)
      }
    }
    return rs
  }

  /**
   * 
   * @param {string} fileId 
   * @param {boolean} status 
   */
  setSongFavorite(fileId, status = true) {
    const linkUp = this.linkUpColum
    const isFav = this.isFavoriteColumn
    for (const [i, fileUrl] of this.linkUpColum.getData().entries()) {
      if (extractFileId(fileUrl) == fileId) {
        let statusRange = this.Sheet.getRange(linkUp.headerCell.row + i + 1, isFav.headerCell.col)
        if (status) {
          statusRange.setValue(status)
        } else {
          statusRange.setValue('')
        }
        return true
      }
    }
    return false
  }
}




