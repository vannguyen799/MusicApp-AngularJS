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

    // const processFilename = this.processFileNameColumn.getData()
    while (filesIterator.hasNext()) {
      let file = filesIterator.next()
      let mimeType = file.getMimeType()
      if (!mimeType.startsWith('audio') && !mimeType.includes('application/x-flac')) { continue }

      let fileName = file.getName()
      if (this.ignoreFile.includes(fileName)) { continue }

      let tmpSinfo = SongInfo.try(fileName)
      let sinfo = allSong.popFilter((s) => s.fileId == file.getId()) || allSong.popFilter((s) => s.name == tmpSinfo.name && s.singer == tmpSinfo.singer)
      if (sinfo) {
        // check file name
        let fomatName = sinfo.getFilename()
        if (fomatName != fileName && !['', null, ' -  |  - '].find(f => f == fomatName)) {
          file.setName(fomatName)
          console.log(`update name: ${sinfo.i} ${fileName} >>>>> ${fomatName} `)
          continue
        }
        // update status file url
        let row = sinfo.i + 1
        if (row > 0) {
          this.Sheet.getRange(row + this.statusColumn.headerCell.row, this.statusColumn.headerCell.col).setValue('ok')
          this.Sheet.getRange(row + this.linkUpColum.headerCell.row, this.linkUpColum.headerCell.col).setValue(file.getUrl())
        } else {
          this.Sheet.getRange(row + this.statusColumn.headerCell.row, this.statusColumn.headerCell.col).setValue('')
        }
      } else {
        // update to sheet
        console.log(`file unprocessed: ${file.getName()}`)
        if (update) {
          console.log(`add to shet: ${tmpSinfo.getFilename()}`)
          this.addSong({
            songName: tmpSinfo.name,
            singerName: tmpSinfo.singer,
            vsinger: tmpSinfo.vsinger,
            vname: tmpSinfo.vname,
            linkUp: file.getUrl(),
            status: 'unprocess'
          })
        }
      }
    }
    for (const s of allSong) {
      console.log(`danger song: ${s.getFilename()}`)
      let row = s.i + 1
      if (row > 0) {
        this.Sheet.getRange(row + this.statusColumn.headerCell.row, this.statusColumn.headerCell.col).setValue('danger')
        this.Sheet.getRange(row + this.linkUpColum.headerCell.row, this.linkUpColum.headerCell.col).setValue(`danger` + (s.fileId && `${s.fileId}` != '' ? ` https://drive.google.com/file/d/${s.fileId}/view?usp=sharing` : ' '))
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
const spliter = 'ǁ'

class SongInfo {
  /** @param {{[name:string]:string}} */
  constructor({ name = '', singer = '', vname = '', vsinger = '', linkUp = '', listens = 0, lyric = '', lyric_vn = '', lyric_en = '', status, sheet, i = -1 }) {
    this.i = parseInt(i)
    this.singer = singer?.trim() || ''
    this.name = name.toString().trim()
    this.vsinger = vsinger?.trim() ?? ''
    this.vname = vname?.trim() ?? ''
    // this.linkUp = linkUp
    this.status = status || ''
    this.lyric = lyric
    this.lyric_vn = lyric_vn
    this.lyric_en = lyric_en
    this.fileId = extractFileId(linkUp)
    this.sheet = sheet || 'Others'
    this.listens = listens || 0
    this.lyric_vn_translated = undefined
    this.lyric_en_translated = undefined
  }
  getUrl() {
    return `https://drive.google.com/file/d/${this.fileId}/view?usp=sharing`
  }
  getFilename() {
    if (!(this.vsinger == this.vname == '')) {
      return `${this.singer} - ${this.name}`
    } else {
      return `${this.vsinger} - ${this.vname} ${spliter} ${this.singer} - ${this.name}`
    }
  }
  /** @param {string} filename  */
  static _removeExt(filename) {
    const fileExt = ['flac', 'wav', 'mp3', 'ape', 'm4a', 'mp4', 'ogg']
    for (const ext of fileExt) {
      if (filename.endsWith(`.${ext}`)) {
        let tmp = filename.split('.')
        tmp.pop()
        filename = tmp.join('.')
      }
    }
    filename = filename.replace('+', ' ')

    return filename.trim()
  }

  /** @param {string} filename  @returns {SongInfo} */
  static fromUploadFilename(filename) {
    filename = this._removeExt(filename)

    /** @param {string} p @param {string} s @returns {string[] | undefined} */
    function test(p, s) {
      if (containOne(s, p)) {
        return s.split(p)
      }
      return undefined
    }
    let res = test('+-+', filename) || test('-', filename) || test(' - ', filename) || ['', filename]


    return new SongInfo({
      name: res[1],
      singer: res[0]
    })
  }

  static try(fileName) {
    fileName = this._removeExt(fileName)
    if (fileName.includes(spliter) || fileName.includes('|') || fileName.includes('   ')) {
      return this.fromFileName(fileName)
    } else {
      return this.fromUploadFilename(fileName)
    }
  }
  /** @param {string} filename  @returns {SongInfo} */
  static fromFileName(filename) {
    filename = this._removeExt(filename)
    let [_vname, _vsinger, _name, _signer] = ['', '', '', '']
    // fomat singerName - SongName | orignSingerName - originSongName
    function testSplit(str) {
      if (filename.includes(str) && filename.indexOf(str) == filename.lastIndexOf(str)) {
        let vs = filename.split(str)[0].split(' - ')
        let origin = filename.split(str)[1].split(' - ')
        return new SongInfo({
          name: origin[1],
          singer: origin[0],
          vname: vs[1],
          vsinger: vs[0]
        })
      }
      if (!str && (filename.includes(' - ') || filename.indexOf("-") == filename.lastIndexOf('-'))) {
        return new SongInfo({
          name: filename.split('-')[1], singer: filename.split('-')[0]
        })
      }
    }
    return testSplit('ǁ') || testSplit('|') || testSplit("   ") || testSplit()
  }
}

