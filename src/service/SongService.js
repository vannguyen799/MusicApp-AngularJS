"use strict"

class SongService {
    /** @private */
    constructor() { }
    
    static fromFileId(fileId) {
        // let song = db.Songs.findOne({ fileId: fileId })
        // return song || SongFileManager.fromFileId(fileId)
        return SongFileManager.fromFileId(fileId)
    }
    /** @param {string | DriveFolderID} categoryName  @returns {SongInfo[]} */
    static getSongs(categoryName) {
        if (isDriveId(categoryName)) {
            return SongFileManager.songFromFolder(categoryName)
        }
        /** @type {SongInfo[]} */
        let songs = []
        
        // Lọc các bài hát theo categoryName
        if (categoryName == 'Chinese') {
            let validSheets = ['Chinese', 'LanXinyu', 'XuLanxin', 'Dengshenmejun', 'AYueYue', 'RenRan']
            for (let sheet of validSheets) {
                songs.push(...new SongFileManager(sheet).getAllSongs({ allowNull: false }))
            }
            // Filter Chinese songs và exclude DJ/Remix
            songs = songs.filter(s => {
                return validSheets.includes(s.sheet) && 
                       !s.name.match(/DJ/i) && 
                       !s.name.match(/Remix/i)
            })
        } else if (categoryName == 'Mix') {
            for (let sheet of ['Mix']) {
                songs.push(...new SongFileManager(sheet).getAllSongs({ allowNull: false }))
            }
            songs = songs.filter(s => {
                return s.sheet == categoryName || 
                       s.name.match(/DJ/i) || 
                       s.name.match(/Remix/i)
            })
        } else {
            songs = new SongFileManager(categoryName).getAllSongs({ allowNull: false })
        }
        
        return songs
        
        /* ===== COMMENTED - Database version =====
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
        ===== END COMMENTED ===== */
    }
    /** @param {SongInfo[]} songs  */
    static updateAllSongs(songs) {
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
    static updateSingleSongs(songs) {
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
    static updateSong(song) {
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

    static addListens(song) {
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