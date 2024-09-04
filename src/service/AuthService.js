class AuthService {
    constructor() { }
    static get instance() {
        return new AuthService()
    }

    auth({
        username, password
    }) {
        const users = this.getUsers()
        if (users.find(u => u.password == password && u.username == username) !== undefined) {
            return {
                authToken: AuthService.generateAuthToken(username)
            }
        }
    }

    getUsers() {
        // simulate
        return admins
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