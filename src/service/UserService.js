class UsersService {
    constructor() { }
    /** @returns {UsersService} */
    static get instance() {
        return instanceOf(this)
    }
    /** @param {UserLike} user  @returns {UserInfo} */
    getUser(user) {
        const u = db.Users.findOne({
            username: user.username
        })

        if (u != null) {
            delete u.password
            u.playlist = PlaylistService.instance._parseSongInfo(u.playlist)

            return u
        } else {
            throw new Error('Couldnt find user ' + user)
        }

    }

    /** @param {UserLike} user  @returns {DriveFileID[]} */
    getFavoriteList(user) {
        let u = db.Users.findOne({
            username: user.username
        })

        if (u != null) {
            return user.favorite || []
        } else {
            throw new Error('Couldnt find user ' + user)
        }
    }

    /** @param {UserLike} user  @param {DriveFileID[]} filesId  @returns {any} */
    addFavorite(user, filesId) {
        let res = db.Users.updateOne({
            username: user.username,
        }, {
            $push: {
                favorite: filesId
            }
        })

        return res
    }

    /** @param {UserLike} user  @param {DriveFileID[]} filesId  @returns {any} */
    rmvFavorite(user, filesId) {
        let res = db.Users.updateOne({
            username: user.username,
        }, {
            $pull: {
                favorite: filesId
            }
        })

        return res
    }
}

/**
 * @typedef {{ username: string,  role: string } | User | UserInfo } UserLike
 */

/** 
 * @typedef {{
* _id: string,
* username: string,
* password: string,
* playlist: Playlist[],
* favorite: DriveFileID[]
* }} User
*/

/** 
* @typedef {{
* _id: string,
* username: string,
* password: string,
* playlist: Playlist[],
* favorite: SongInfo[]
* }} UserInfo
*/