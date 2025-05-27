'use strict'
/** @extends {ISheetManager} */
class SongFileManager extends SM.Sheet.SheetManager {
  static fromFileId(fileId) {
    let file = DriveApp.getFileById(fileId)
    if (file) {
      let song = SongInfo.try(file.getName())
      song.fileId = file.getId()
      return song
    }
  }
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

  loadData() {

    super.loadData()

    return this
  }

  fixRevision() {
    let files = this.folder.getFiles()
    while (files.hasNext()) {
      let file = files.next()
      if (!isAudioMimeType(file.getMimeType())) continue
      if (file.getOwner().getEmail() != Session.getActiveUser().getEmail()) continue
      let id = file.getId()
      var revisions = Drive.Revisions.list(id)

      let c = {
        max: 0, rvs: {}
      }
      revisions.revisions.forEach(function (revision) {
        if (c.rvs.id == undefined) {
          return c = {
            max: new Date(revision.modifiedTime).getTime(),
            rvs: revision
          }
        }
        try {
          if (new Date(revision.modifiedTime).getTime() < c.max) {
            Drive.Revisions.remove(id, revision.id);
            console.log(id, revisions.revisions.length, 'delete', revision.id)
          } else {
            Drive.Revisions.remove(id, c.rvs.id);
            console.log(id, revisions.revisions.length, 'delete', c.rvs.id)

            c = {
              max: new Date(revision.modifiedTime).getTime(),
              rvs: revision
            }
          }
        } catch (e) {
          console.log(revision, e)
        }
      });
    }
  }
  static songFromFolder(folderId) {
    if (!isDriveId(folderId)) { return [] }
    const filesIterator = DriveApp.getFolderById(folderId).getFiles()
    const rs = []
    while (filesIterator.hasNext()) {
      const file = filesIterator.next()
      let mtype = file.getMimeType()
      if (mtype.startsWith('audio') || mtype.includes('flac')) {
        let s = SongInfo.try(file.getName())
        s.fileId = file.getId()
        s.sheet = folderId

        rs.push(s)
      }
    }
    return rs
  }
  process({ update }) {
    console.log('processing... ' + this.sheetName)
    console.log(update)

    const filesIterator = this.folder.getFiles()
    const allSong = this.getAllSongs({ allowNull: true })
    console.log('all song count ', allSong.length)

    // const processFilename = this.processFileNameColumn.getData()
    while (filesIterator.hasNext()) {
      const file = filesIterator.next()
      const fileName = file.getName()

      if (file.isTrashed()
        || !isAudioMimeType(file.getMimeType())
        || this.ignoreFile.includes(fileName)) {
        continue
      }

      const tempSong = SongInfo.try(fileName)
      const song = popAndRemove(allSong, (s) => (s.fileId == file.getId()) || (s.name == tempSong.name && s.singer == tempSong.singer))
      console.log(song?.i, tempSong.fileId, tempSong.name, tempSong.singer, '\n', file.getId(), song?.name, song?.singer)
      console.log(file.getName())
      /** @param {SongInfo} song @param {string} fileName @returns {boolean}  */
      function validFileName(song, fileName) {
        const fomatedName = song.getFilename()
        if (fomatedName != fileName && !['', null, ' -  |  - ', undefined].find(f => f == fomatedName)) {
          return false
        }
        return true
      }
      if (song) {
        song.setFile(file)
        // check file name
        if (!validFileName(song, fileName)) {
          file.setName(song.getFilename())
          // Drive.Files.update(file.getId(), { name: song.getFilename() })
          console.log(`update name: ${song.i} ${fileName} >>>>> ${song.getFilename()} `)
        }
        // update status file url
        if (song.fileId != file.getId()) {
          let row = song.i + 1
          if (row > 0) {
            this.Sheet.getRange(row + this.statusColumn.headerCell.row, this.statusColumn.headerCell.col).setValue('ok')
            this.Sheet.getRange(row + this.linkUpColum.headerCell.row, this.linkUpColum.headerCell.col).setValue(file.getUrl())
          } else {
            this.Sheet.getRange(row + this.statusColumn.headerCell.row, this.statusColumn.headerCell.col).setValue('')
          }
        }
      } else {
        // update to sheet
        console.log(`file unprocessed: ${file.getName()} ${file.getUrl()}`)
        if (update) {
          console.log(`add song to shet: ${tempSong.getFilename()}`)
          this.addSong({
            songName: tempSong.name,
            singerName: tempSong.singer,
            vsinger: tempSong.vsinger,
            vname: tempSong.vname,
            linkUp: file.getUrl(),
            status: 'unprocess'
          })
        }
      }
    }
    console.log('danger count ' + allSong.length)

    for (const s of allSong) {
      console.log(`danger song: ${s.getFilename()}`)
      let row = s.i + 1
      if (row > 0) {
        this.Sheet.getRange(row + this.statusColumn.headerCell.row, this.statusColumn.headerCell.col).setValue('danger')
        // this.Sheet.getRange(row + this.linkUpColum.headerCell.row, this.linkUpColum.headerCell.col).setValue(`danger` + (s.fileId && `${s.fileId}` != '' ? ` https://drive.google.com/file/d/${s.fileId}/view?usp=sharing` : ' '))
        this.Sheet.getRange(row + this.linkUpColum.headerCell.row, this.linkUpColum.headerCell.col).setValue(``)
      } else {
      }
    }
  }
  pFileId() {
    console.log('processingName... ' + this.sheetName)

    const allSong = this.getAllSongs({ allowNull: false })

    for (const s of allSong) {
      let f = undefined
      try {
        let f = DriveApp.getFileById(s.fileId)
      } catch (e) {
        console.log(e)
        let fs = this.folder.getFiles()
        while (fs.hasNext()) {
          let _f = fs.next()
          if (_f.getName().startsWith(`${s.vsinger} - ${s.vname}   ${s.singer}`) && _f.getMimeType().includes('flac')) {
            f = _f
            break
          }
        }
      }
      if (f && s.getFilename() != f?.getName()) {
        console.log('rename', f.getName(), '>', s.getFilename())
        f.setName(s.getFilename())
      } else {
        if (!f) {
          console.log('err: ', s.getFilename(), s.fileId)
        }
      }
    }
  }

  updateFileName() {
    const allSong = this.getAllSongs({ allowNull: false })
    for (const song of allSong) {
      try {
        let file = DriveApp.getFileById(song.fileId)
        if (file && file.getName() != song.getFilename()) {
          file.setName(song.getFilename())
        }
      } catch (e) {
        console.log(e)
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
  /** @param {{allowNull: boolean}} @returns {SongInfo[]}*/
  getAllSongs({ allowNull } = { allowNull: false }) {
    console.log('getAllSongs ' + this.sheetName)
    const vnames = this.vnameColumn.getData()
    const vsingers = this.vsingerColumn.getData()
    const linkUp = this.linkUpColum.getData()
    const names = this.songNameColumn.getData()
    const singers = this.singerNameColumn.getData()
    const listenss = this.listensColumn.getData()
    const lrc = this.lyricColumn.getData()
    const lrc_vn = this.vnlyricColumn.getData()
    const lrc_en = this.enlyricColumn.getData()
    const status = this.statusColumn.getData()

    let rs = []
    for (const i in vnames) {
      let s = new SongInfo({
        status: status[i],
        name: names[i],
        singer: singers[i],
        linkUp: linkUp[i],
        vname: vnames[i],
        vsinger: vsingers[i],
        listens: isNaN(parseInt(listenss[i])) ? 0 : listenss[i],
        sheet: this.sheetName,
        lyric: lrc[i],
        lyric_vn: lrc_vn[i],
        lyric_en: lrc_en[i],
        i: i
      })
      if (s.fileId != null) {
        rs.push(s)
      } else if (allowNull) {
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
          // console.log(column.cells[i].value, v, k)
          if (column != null && column.cells[i].value != v) {
            // console.log(k, 'update')

            if (['name', 'singer', 'vname', 'vsinger'].find(n => n == k)) {
              rename = true
            }
            console.log(k, 'update', v)
            this.Sheet.getRange(column.headerCell.row + i + 1, column.headerCell.col).setValue(v)
          }
        }
        console.log('rename', rename)
        if (rename) {
          let formatedName = new SongInfo(songInfo).getFilename()
          console.log('rename >>>', formatedName)
          DriveApp.getFileById(songInfo.fileId).setName(formatedName)
        }
        return true
      }
    }
    return false
  }
}

