/**
 * @typedef {Object} Playlist
 * @property {number} id - The unique identifier for the playlist.
 * @property {string} name - The name of the playlist.
 * @property {string} notes - The creator of the playlist.
 * @property {boolean} hidden - The creator of the playlist.
 * @property {SongInfo[]} songList - An array of songs in the playlist.
 */

class PlaylistService {
    constructor() { }

    /** @returns {PlaylistService} */
    static get instance() {
        return instanceOf(this)
    }

    /**
     * 
     * @returns {Playlist[]}
     */
    getPlaylist(user) {
        let playlist = db.Users.findOne({
            username: user.username
        }, {
            _id: 0,
            playlist: 1
        })
        return this._parseSongInfo(playlist) || []
    }

    addPlaylist(user, playlist) {
        if (!this.checkPlaylist(playlist)) {
            throw new Error('invalid playlist ' + playlist)
        }
        let p = db.Users.findOne({
            username: user.username,
            'playlist.name': playlist.name
        })
        if (p != null) throw new Error('DuplicateName')
        playlist.songList.map(m => m.fileId)

        let res = db.Users.updateOne({
            username: user.username,
        }, {
            $push: {
                playlist: playlist
            }
        })
        return res
    }
    _parseSongInfo(playlist) {
        if (playlist) {
            let songs = SongService.instance.getSongs()
            playlist.songList?.map(fid => {
                return songs.find(s => s.fileId == fid)
            })
        }
        return playlist
    }

    removePlaylist(user, playlist) {
        let res = db.Users.updateOne({
            username: user.username,
        }, {
            $pull: {
                playlist: {
                    name: playlist.name
                }
            }
        })
        return res
    }

    updatePlaylist(user, playlist) {
        if (!this.checkPlaylist(playlist)) {
            throw new Error('invalid playlist ' + playlist)
        }
        playlist.songList.map(m => m.fileId)

        let res = db.Users.updateOne({
            username: user.username,
            'playlist.name': playlist.name
        }, {
            $set: {
                'playlist.$': playlist
            }
        })
        return res
    }

    checkPlaylist(...pls) {
        for (const pl of pls) {
            if (!pl.name || pl.name == '') { return false }
            if (!pl.songList || !Array.isArray(pl.songList)) { return false }
            // if (!pl.creator || pl.creator == '') { return false }
            delete pl["$$hashKey"]
            delete pl["'$$hashKey'"]
        }
        return true
    }
}