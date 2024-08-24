/**
 * @typedef {Object} Playlist
 * @property {number} id - The unique identifier for the playlist.
 * @property {string} name - The name of the playlist.
 * @property {string} creator - The creator of the playlist.
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
        this.file.setContent(JSON.stringify(__data))
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
        return data
    }
    /**
     * 
     * @param {Playlist} playlist 
     */
    createPlaylist(playlist) {
        console.log(playlist)

        let data = this.getJson()
        let maxid = 0
        for (const p of data) {
            if (p.id > maxid) maxid = p.id
        }
        playlist.id = maxid + 1
        data.push(playlist)
        console.log(data)
        this.change(data)
    }
    /**
     * 
     * @param {Number} id 
     */
    removePlaylist(id) {
        let data = this.getJson().filter(p => p.id != id)
        this.change(data)
    }
    /**
     * 
     * @param {Playlist} playlist 
     */
    updatePlaylist(playlist) {
        console.log(playlist)
        let data = this.getJson().map(d => {
            if (d.id == playlist.id) {
                d = playlist
            }
        })

        this.change(data)
    }
}