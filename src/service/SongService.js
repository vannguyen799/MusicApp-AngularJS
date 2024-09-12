class SongService {
    constructor() { }
    static get instance() {
        return new SongService()
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
            let a = res.filter(r => !r.deleted)
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
}