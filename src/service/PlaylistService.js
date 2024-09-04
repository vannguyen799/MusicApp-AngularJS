/**
 * @typedef {Object} Playlist
 * @property {number} id - The unique identifier for the playlist.
 * @property {string} name - The name of the playlist.
 * @property {string} creator - The creator of the playlist.
 * @property {boolean} hidden - The creator of the playlist.
 * @property {SongInfo[]} songList - An array of songs in the playlist.
 */
class PlaylistService {
    constructor() {
        this.fileName = 'db.Playlist.json'
        this.folder = this.getFolder()
        this.file = this.getFile()
    }
    /**
     * @returns {PlaylistService}
     */
    static get instance() {
        return new PlaylistService()
    }

    getFolder() {
        // var ss = SpreadsheetApp.getActiveSpreadsheet();
        // var fileId = ss.getId();
        // console.log(fileId)
        // var file = DriveApp.getFileById(fileId);

        // return file.getParents().next();
        return DriveApp.getFolderById('1xkWWdtJ8pqYTTXECP8ZvOEUXKxUZTPGm')
    }
    getFile() {
        return DriveApp.getFileById('1ldSKxiaiZVapXd7hknre6NCq7KprhTD0')

        // let files = this.folder.getFilesByName(this.fileName)
        // if (files.hasNext()) {
        //     return files.next()
        // } else {
        //     let file = this.folder.createFile(this.fileName, '[]');
        //     return file
        // }
    }
    /**
         * 
         * @param {Playlist[]} __data
         *  
         */
    change(__data) {
        if (this.checkPlaylist(...__data)) {
            this.file.setContent(JSON.stringify(__data))
        } else {
            throw new Error('playlist invalid: got ' + JSON.stringify(__data))
        }
    }
    reset() {
        this.file.setContent('[]')
    }
    /**
     * 
     * @returns {Playlist[]}
     */
    getJson() {
        return JSON.parse(this.file.getBlob().getDataAsString())
    }
    /**
     * 
     * @returns {Playlist[]}
     */
    getAllPlaylist() {
        let data = this.getJson()
        if (this.checkPlaylist(...data)) {
            return data.filter(p => p.hidden == undefined || p.hidden == false)
        }
    }
    /**
     * 
     * @param {Playlist} playlist 
     */
    createPlaylist(playlist) {
        console.log(playlist)
        if (!Array.isArray(playlist.songList)) {
            throw new Error('invalid playlist' + playlist)
        }
        let data = this.getJson()
        let maxid = 0
        for (const p of data) {
            if (p.id > maxid) maxid = p.id
        }
        playlist.id = maxid + 1
        data.push(playlist)
        console.log(data)
        this.change(data)
        return playlist
    }
    /**
     * 
     * @param {Number} id 
     */
    removePlaylist(playlist) {
        let data = this.getJson().map(d => {
            if (d.id == playlist.id) {
                d.hidden == true
            }
            return d
        })
        this.change(data)
    }
    /**
     * 
     * @param {Playlist} playlist 
     */
    updatePlaylist(playlist) {
        let data = this.getJson().map(d => {
            if (d.id == playlist.id) {
                d = playlist
            }
            return d
        })
        // console.log(data)

        this.change(data)

        return playlist
    }

    checkPlaylist(...pls) {
        for (const pl of pls) {
            if (!pl.name || pl.name == '') { return false }
            if (!pl.songList || !Array.isArray(pl.songList)) { return false }
            if (!pl.creator || pl.creator == '') { return false }
            delete pl["$$hashKey"]
            delete pl["'$$hashKey'"]
        }
        return true
    }
}