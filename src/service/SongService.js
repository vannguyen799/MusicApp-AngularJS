class SongService {
    constructor() { }
    /** @returns {SongService} */
    static get instance() {
        return instanceOf(this)
    }
    fromFileId(fileId) {
        let song = db.Songs.findOne({ fileId: fileId })
        return song || SongFileManager.fromFileId(fileId)
    }
    /** @param {string | DriveFolderID} categoryName  @returns {SongInfo[]} */
    getSongs(categoryName) {
        if (isDriveId(categoryName)) {
            return SongFileManager.songFromFolder(categoryName)
        }
        let filter = categoryName ? { sheet: categoryName } : {}
        if (categoryName == 'Chinese') {

            filter = {
                sheet: {
                    '$in': [
                        'Chinese',
                        'LanXinyu',
                        'XuLanxin',
                        'Dengshenmejun',
                        'AYueYue',
                        'RenRan'
                    ],
                }, $and: [
                    { name: { $not: { $regex: 'DJ', $options: 'i' } } },
                    { name: { $not: { $regex: 'Remix', $options: 'i' } } }
                ]
            }
        }
        if (categoryName == 'Mix') {
            filter = {
                '$or': [
                    { sheet: categoryName },
                    { name: { $regex: 'DJ', $options: 'i' } },
                    { name: { $regex: 'Remix', $options: 'i' } }
                ]
            }
        }
        let res = db.Songs.find(filter)
        let a = res.filter(r => !r.deleted && !['', 'danger'].includes(r.status))
        return a
    }
    /** @param {SongInfo[]} songs  */
    updateAllSongs(songs) {
        db.Songs.deleteMany()
        songs.forEach(s => {
            if (s.lyric != '' && s.lyric_vn == '') {
                s.lyric_vn_translated = translate(s.lyric)?.lrc || ''
            }
        });
        let a = db.Songs.insertMany(songs)
        return a
    }
    /** @param {SongInfo[]} songs  */
    updateSingleSongs(songs) {
        db.Songs.deleteMany({ sheet: songs[0].sheet })
        songs.forEach(s => {
            if (s.lyric != '' && s.lyric_vn == '') {
                s.lyric_vn_translated = translate(s.lyric)?.lrc || ''
                Utilities.sleep(100)
            }
        });
        let a = db.Songs.insertMany(songs)
        return a
    }
    /** @param {SongInfo} song  */
    updateSong(song) {
        if (isDriveId(song.sheet)) return
        let sheetStt = new SongFileManager(song.sheet).updateSong(song)
        if (sheetStt) {
            if (song.lyric != '' && song.lyric_vn == '' && (!song.lyric_vn_translated || song.lyric_vn_translated == '')) {
                song.lyric_vn_translated = translate(song.lyric)?.lrc || undefined
            }
            delete song._id
            let dbRes = db.Songs.replaceOne({
                _id: {
                    $oid: song._id
                },
                fileId: song.fileId
            }, song)

            console.log(dbRes)
            return dbRes
        }

    }

    addListens(song) {
        if (!isDriveId(song.sheet)) {
            new SongFileManager(song.sheet).addListens(song)
            return db.Songs.updateOne({
                fileId: song.fileId
            }, {
                $inc: {
                    listens: 1
                }
            })
        }
        return true
    }
}