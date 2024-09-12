
var db = {
    Users: new WebApp.MongoDBAtlasCollection({
        ...secrect_.db,
        collection: 'Users'
    }),
    Songs: new WebApp.MongoDBAtlasCollection({
        ...secrect_.db,
        collection: 'songs'
    })
}
