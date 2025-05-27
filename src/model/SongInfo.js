
class SongInfo {
    static get spliter() {
        return 'ǁ'
    }

    /** @param {{[name:string]:string | number}} */
    constructor({
        name = '',
        singer = '',
        vname = '',
        vsinger = '',
        linkUp = '',
        listens = 0,
        lyric = '',
        lyric_vn = '',
        lyric_en = '',
        status, sheet,
        i = -1,
        ext = '',
        mime = ''
    }) {
        if (vname.startsWith("?")) {
           vname =  vname.replace('?','_')
        }

        
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
        this.ext = ext || mimeToExt(mime)
        this.filename = this.getFilename()
    }
    getUrl() {
        return `https://drive.google.com/file/d/${this.fileId}/view?usp=sharing`
    }

    
    setFile(file) {
        this._file = file
        this.ext = mimeToExt(file.getMimeType())
    }

    getFilename() {
        let filename = ''
        if (!(this.vsinger == this.vname == '')) {
            filename = `${this.singer} - ${this.name}`
        } else {
            filename = `${this.vsinger} - ${this.vname} ${SongInfo.spliter} ${this.singer} - ${this.name}`
        }

        if (filename.startsWith(' - ')) {
            filename = filename.slice(3)
        }
        if (filename.startsWith('- ')) {
            filename = filename.slice(2)
        }

        return (this.ext && this.ext != '' ? `${filename}.${this.ext}` : filename).trim()
    }
    /** @param {string} filename  */
    static _removeExt(filename) {
        const fileExt = ['flac', 'wav', 'mp3', 'ape', 'm4a', 'mp4', 'ogg']
        let ext_tmp = ''
        for (const ext of fileExt) {
            if (filename.endsWith(`.${ext}`)) {
                if (ext_tmp == '') { ext_tmp = ext }
                let tmp = filename.split('.')
                tmp.pop()
                filename = tmp.join('.')
                break
            }
        }
        filename = filename.replace('+', ' ')

        return [filename.trim(), ext_tmp]
    }
    /** @param {string} filename_  @returns {SongInfo} */
    static fromUploadFilename(filename) {
        let [filename_, ext_] = this._removeExt(filename)

        /** @param {string} p @param {string} s @returns {string[] | undefined} */
        function test(p, s) {
            if (containOne(s, p)) {
                return s.split(p)
            }
            return undefined
        }
        let res = test('+-+', filename_) || test('-', filename_) || test(' - ', filename_) || ['', filename_]


        return new SongInfo({
            name: res[1], singer: res[0], ext: ext_
        })
    }

    static try(fileName) {
        if (fileName.includes(SongInfo.spliter) || fileName.includes('|') || fileName.includes('   ')) {
            return this.fromFileName(fileName)
        } else {
            return this.fromUploadFilename(fileName)
        }
    }
    /** @param {string} filename_  @returns {SongInfo} */
    static fromFileName(filename) {
        let [filename_, ext_] = this._removeExt(filename)
        let [_vname, _vsinger, _name, _signer] = ['', '', '', '']
        // fomat singerName - SongName | orignSingerName - originSongName
        function testSplit(str) {
            if (filename_.includes(str) && filename_.indexOf(str) == filename_.lastIndexOf(str)) {
                let vs = filename_.split(str)[0].split(' - ')
                let origin = filename_.split(str)[1].split(' - ')
                return new SongInfo({
                    name: origin[1],
                    singer: origin[0],
                    vname: vs[1],
                    vsinger: vs[0]
                })
            }
            if (!str && (filename_.includes(' - ') || filename_.indexOf("-") == filename_.lastIndexOf('-'))) {
                return new SongInfo({
                    name: filename_.split('-')[1], singer: filename_.split('-')[0], ext: ext_
                })
            }
        }
        return testSplit('ǁ') || testSplit('|') || testSplit("   ") || testSplit()
    }

    static compareSinger(singer1, singer2) {
        if (Array.isArray(singer1)) {
            singer1 = singer1.join(',')
        }
        if (Array.isArray(singer2)) {
            singer2 = singer2.join(',')
        }
        function mapSinger(singer) {
            return singer
        }
        singer1 = mapSinger(singer1)
        singer2 = mapSinger(singer2)
        return singer1 == singer2
    }

    static compareName(name1, name2) {
        function mapName(name) {
            return name
        }
        name1 = mapName(name1)
        name2 = mapName(name2)
        return name1 == name2
    }
}
