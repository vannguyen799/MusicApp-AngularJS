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
      name: 'name',
      singer: 'singer',
      linkUp: 'link up',
      status: 'status',
      filename: 'filename',
      vname: 'vname',
      vsinger: 'vsinger',
      isFavorite: 'isFavorite',
      'listens': 'listens',
      lyric: 'lyric',
      lyric_vn: 'lyric_vn',
      lyric_en: 'lyric_en'
    }
    this.ignoreFile = [SpreadsheetApp.getActiveSpreadsheet().getName()]
  }

  validateClass() {
    return this.forderId != ''
  }
  get songNameColumn() {
    return this.getColumn(this.tableHeader.name, null, false)
  }
  get singerNameColumn() {
    return this.getColumn(this.tableHeader.singer, null, false)
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
    return this.getColumn(this.tableHeader.vsinger, null, false)
  }
  get isFavoriteColumn() {
    return this.getColumn(this.tableHeader.isFavorite, null, false)
  }
  get listensColumn() {
    return this.getColumn(this.tableHeader.listens, null, false)
  }
  get lyricColumn() {
    return this.getColumn(this.tableHeader.lyric, null, false)
  }
  get vnlyricColumn() {
    return this.getColumn(this.tableHeader.lyric_vn, null, false)
  }
  get enlyricColumn() {
    return this.getColumn(this.tableHeader.lyric_en, null, false)

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

  /** @returns {string} */
  toFomartedName(singer, name, vsinger, vname) {

    if (this.originalNameOnly) {
      return `${singer} - ${name}`
    } else {
      return `${vsinger} - ${vname} | ${singer} - ${name}`
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
    const listenss = this.listensColumn.getData()
    const lrc = this.lyricColumn.getData()
    const lrc_vn = this.vnlyricColumn.getData()
    const lrc_en = this.enlyricColumn.getData()

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
        listens: isNaN(parseInt(listenss[i])) ? 0 : listenss[i],
        sheet: this.sheetName,
        lyric: lrc[i],
        lyric_vn: lrc_vn[i],
        lyric_en: lrc_en[i]
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

  addListens(songInfo) {
    const linkUp = this.linkUpColum
    const listenss = this.listensColumn
    for (const [i, fileUrl] of this.linkUpColum.getData().entries()) {
      if (extractFileId(fileUrl) == songInfo.fileId) {
        let listens = this.Sheet.getRange(linkUp.headerCell.row + i + 1, listenss.headerCell.col)
        let valLs = parseInt(listens.getValue())
        if (isNaN(valLs)) {
          listens.setValue(1)
        } else {
          listens.setValue(valLs + 1)
        }
        songInfo.listens += 1
      }
    }
    return songInfo
  }
  updateSong(songInfo) {
    const linkUp = this.linkUpColum
    for (const [i, fileUrl] of linkUp.getData().entries()) {
      if (extractFileId(fileUrl) == songInfo.fileId) {
        // console.log(i)

        let rename = false
        for (const [k, v] of Object.entries(songInfo)) {
          // console.log(k, v, 'update')
          if (typeof this.tableHeader[k] !== 'string') {
            continue
          }
          let column = this.getColumn(this.tableHeader[k], null, false)
          console.log(column.cells[i].value, v, k)
          if (column != null && column.cells[i].value != v) {
            console.log(k, 'update')

            if (['name', 'singer', 'vname', 'vsinger'].find(n => n == k)) {
              rename = true
            }
            // console.log(k, 'update')
            this.Sheet.getRange(column.headerCell.row + i + 1, column.headerCell.col).setValue(v)
          }
        }
        if (rename) {
          let formatedName = this.toFomartedName(songInfo.singer, songInfo.name, songInfo.vsinger, songInfo.vname)
          DriveApp.getFileById(songInfo.fileId).setName(formatedName)
        }
        return songInfo
      }
    }
  }
}




