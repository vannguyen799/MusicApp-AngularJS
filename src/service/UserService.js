// class UsersService {
//     constructor() {
//         this.db = new WebApp.MongoDBAtlasCollection({
//             ...env.db,
//             collection: 'Users'
//         })
//     }
//     static get instance() {
//         return new UsersService()
//     }

//     register(user) {
//         let _user = this.db.findOne({
//             username: user.username
//         })
//         if (_user == null) {
//             this.db.insertOne({...user, role:})
//         }
//     }

//     login(user) {

//     }
// }