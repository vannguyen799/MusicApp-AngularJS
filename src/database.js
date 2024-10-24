
var db = {
    /** @type {IWebApp.MongoDBAtlasCollection<User>} */
    Users: new WebApp.MongoDBAtlasCollection({
        ...secrect_.db,
        collection: 'Users'
    }),
    /** @type {IWebApp.MongoDBAtlasCollection<SongInfo>} */
    Songs: new WebApp.MongoDBAtlasCollection({
        ...secrect_.db,
        collection: 'songs'
    })
}

