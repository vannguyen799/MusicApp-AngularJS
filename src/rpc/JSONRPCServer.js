class JSONRPCServer extends WebApp.JSONRPCServer {
    constructor() {
        super();
    }

    static get instance() {
        return instanceOf(this)
    }

    getAllApiKey() {
        return secrect_.driveApiKey;
    }

    getSongs(sheetName) {
        const songs = SongService.instance.getSongs(sheetName);
        return songs
    }

    getAllSheetName() {
        return getAllSheetName();
    }

    getPlaylist(session) {
        return PlaylistService.instance.getPlaylist(session.user);
    }

    addPlaylist(playlist, session) {
        return PlaylistService.instance.addPlaylist(session.user, playlist);
    }

    removePlaylist(playlist, session) {
        return PlaylistService.instance.removePlaylist(session.user, playlist);
    }

    updatePlaylist(playlist, session) {
        return PlaylistService.instance.updatePlaylist(session.user, playlist);
    }

    getUserInfo(session) {
        return UsersService.instance.getUser(session.user);
    }

    login(user) {
        return AuthService.instance.login(user);
    }

    register(user) {
        return AuthService.instance.register(user);
    }

    setFavoriteSong(fileIds, session) {
        return UsersService.instance.addFavorite(session.user, fileIds);
    }

    rmvFavoriteSong(fileIds, session) {
        return UsersService.instance.rmvFavorite(session.user, fileIds);
    }

    addListens(song) {
        return SongService.instance.addListens(song);
    }

    /** @param {SongInfo} song*/
    updateSong(song, session) {
        const u = UsersService.instance.getUser(session.user.username);
        if (u.role != ROLE.ADMIN) {
            throw new Error('Require Admin Role');
        }
        try {
            return SongService.instance.updateSong(song);
        } catch (e) {
            console.log(e);
            return UrlFetchApp.fetch(ScriptApp.getService().getUrl(), genRPCrequest_('updateSong', [song], session.token));
        }
    }

    verifyAuthToken(token) {
        return AuthService.instance.verifyAuthToken(token);
    }

    getAudio(fileid) {
        const file = DriveApp.getFileById(fileid);
        if (isAudioMimeType(file.getMimeType())) {
            return Utilities.base64Encode(file.getBlob().getBytes());
        }
        return false;
    }
}
