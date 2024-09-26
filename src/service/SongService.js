class SongService {
    constructor() { }
    /** @returns {SongService} */
    static get instance() {
        return instanceOf(this)
    }

    getSongs(categoryName) {
        let res = db.Songs.find(categoryName ? {
            sheet: categoryName,
            deleted: { $exists: false }
        } : {})
        if (res?.length == 0 || res == null) {
            db.Songs.find(categoryName ? {
                sheet: categoryName,
                deleted: { $exists: true }
            } : { deleted: { $exists: true } })
        }
        if (res != null) {
            let a = res.filter(r => !r.deleted && !['', 'danger'].includes(r.status))
            if (a.length == 0) {
                return res
            } else return a
        }
    }
    updateAllSongs(songs) {
        db.Songs.updateMany({}, {
            $set: { deleted: true }
        })
        let a = db.Songs.insertMany(songs)
        db.Songs.deleteMany({ deleted: true })
        return a
    }
    /** @param {SongInfo} song  */
    updateSong(song) {
        let sheetStt = new SongFileManager(song.sheet).updateSong(song)
        if (sheetStt) {
            return db.Songs.replaceOne({
                _id: song._id,
                fileId: song.fileId
            }, song)
        }
        throw new Error('update song err on sheet')
    }
    addListens(song) {
        new SongFileManager(song.sheet).addListens(song)
        return db.Songs.updateOne({
            fileId: song.fileId
        }, {
            $inc: {
                listens: 1
            }
        })
    }
}