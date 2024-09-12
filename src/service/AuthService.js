class AuthService {
    constructor() {
        this.secrectKey = secrect_.secrectKey
        this.dbusers = db.Users
    }
    static get instance() {
        return new AuthService()
    }

    getUser(user) {
        return this.dbusers.findOne({
            username: user.username
        })
    }

    login({ username, password }) {
        const user = this.dbusers.findOne({
            username: username, password: password
        })
        if (user != null) {
            delete user.password
            user.playlist = PlaylistService.instance._parseSongInfo(user.playlist)
            return {
                token: this.generateAuthToken(user),
                user: user
            }
        } else {
            throw new Error("LoginFailed" + user.username)
        }
    }
    register(user) {
        let _user = this.dbusers.findOne({
            username: user.username
        })
        if (_user == null) {
            this.dbusers.insertOne({ ...user, role: WebApp.Role.USER })
            return this.login(user)
        } else {
            throw new Error('Register Failed ' + user.username)
        }
    }
    generateAuthToken(user) {
        const exprieTime = new Date().getTime() + 1000 * 60 * 60 * 24;
        const dataToHash = `${user.username}::${user.role}::${exprieTime}::${this.secrectKey}`;
        const authKey = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, dataToHash));
        // return Utilities.base64Encode(`${authKey}::${user.username}::${user.role}::${exprieTime}`);
        return Utilities.base64Encode(`${authKey}::${user.username}::${user.role}`) + `::${exprieTime}`
    }
    verifyAuthToken(token) {
        let [_token, exprieTime] = token.split('::')
        _token = String.fromCharCode(...Utilities.base64Decode(_token))
        const [authTk, username, role] = _token.split("::");
        if (new Date().getTime() < exprieTime) {
            const dataToHash = `${username}::${role}::${exprieTime}::${this.secrectKey}`;
            const recalculatedHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, dataToHash));
            if (authTk === recalculatedHash) {
                return {
                    token: token,
                    user: {
                        username: username,
                        role: role
                    }
                }
            }
        }
        return false;
    }

}