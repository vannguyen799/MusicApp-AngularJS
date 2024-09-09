class AuthService extends WebApp.BaseAuthService {
    constructor() {
        super(secretKey)
        this.db = new WebApp.MongoDBAtlasCollection({
            ...env.db,
            collection: 'Users'
        })
    }

    static get instance() {
        return new AuthService()
    }

    auth_({
        username, password
    }) {
        const users = this.getUsers()
        if (users.find(u => u.password == password && u.username == username) !== undefined) {
            return {
                authToken: AuthService.generateAuthToken(username)
            }
        }
    }

    getUser(user) {
        return this.db.findOne({
            username: user.username
        })
    }

    register(user) {
        let _user = this.db.findOne({
            username: user.username
        })
        if (_user == null) {
            this.db.insertOne({ ...user, role: WebApp.Role.USER })
        } else {
            throw new Error('Register Failed ' + user.username)
        }
    }

    static generateAuthToken(username) {
        const exprieTime = new Date().getTime() + 1000 * 60 * 60
        const dataToHash = `${username}::${exprieTime}::${secretKey}`

        const authKey = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, dataToHash));
        return `${authKey}::${username}::${exprieTime}`;
    }

    static verifyAuthToken(authKey) {
        const [providedHash, username, providedTimestamp] = authKey.split("::");

        if (new Date().getTime() < providedTimestamp) {
            const dataToHash = `${username}::${providedTimestamp}::${secretKey}`
            const recalculatedHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, dataToHash));

            return providedHash === recalculatedHash;
        }
        return false
    }
}