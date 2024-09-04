class UserService {
    constructor() { }
    static get instance() {
        return new UserService()
    }
}