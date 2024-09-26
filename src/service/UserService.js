class UsersService {
    constructor() {

    }
    /** @returns {UsersService} */
    static get instance() {
        return instanceOf(this)
    }
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