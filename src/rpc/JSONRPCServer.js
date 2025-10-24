"use strict";

class JSONRPCServer extends WebApp.JSONRPCServer {
    constructor() {
        super();
        this.scriptApp = ScriptApp;
    }

    /** @returns {JSONRPCServer} */
    static get instance() {
        return instanceOf(this);
    }

    getAllApiKey() {
        return secrect_.driveApiKey;
    }

    getOauth20Client() {
        return secrect_.oauth20client;
    }

    getServiceAccount() {
        const s = getDriveServiceAccountOauth2();
        if (!s.hasAccess()) {
            s.refresh();
        }
        if (!s.hasAccess()) {
            throw new Error("Service account has no access , " + s.getLastError());
        }
        const token = s.getToken();
        return {
            access_token: token.access_token,
            expires_in: token.expiresAt,
        };
    }

    getSongs(sheetName) {
        const songs = SongService.getSongs(sheetName);
        return songs;
    }

    getAllSheetName() {
        return getAllSheetName();
    }

    getPlaylist(session) {
        return PlaylistService.getPlaylist(session.user);
    }

    addPlaylist(playlist, session) {
        return PlaylistService.addPlaylist(session.user, playlist);
    }

    removePlaylist(playlist, session) {
        return PlaylistService.removePlaylist(session.user, playlist);
    }

    updatePlaylist(playlist, session) {
        return PlaylistService.updatePlaylist(session.user, playlist);
    }

    getUserInfo(session) {
        return UsersService.getUser(session.user);
    }

    login(user) {
        return AuthService.login(user);
    }

    register(user) {
        return AuthService.register(user);
    }

    setFavoriteSong(fileIds, session) {
        return UsersService.addFavorite(session.user, fileIds);
    }

    rmvFavoriteSong(fileIds, session) {
        return UsersService.rmvFavorite(session.user, fileIds);
    }

    addListens(song) {
        return SongService.addListens(song);
    }

    /** @param {SongInfo} song*/
    updateSong(song, session) {
        const u = UsersService.getUser(session.user.username);
        if (u.role != ROLE.ADMIN) {
            throw new Error("Require Admin Role");
        }
        try {
            return SongService.updateSong(song);
        } catch (e) {
            console.log(e);
            return this.callWithAPI("updateSong", [song], session.token);
        }
    }

    verifyAuthToken(token) {
        return AuthService.verifyAuthToken(token);
    }

    getAudio(fileid) {
        const file = DriveApp.getFileById(fileid);
        if (isAudioMimeType(file.getMimeType())) {
            return Utilities.base64Encode(file.getBlob().getBytes());
        }
        return false;
    }

    admin_dbSingleSheetPush(sheetName, session) {
        const u = UsersService.getUser(session.user.username);
        if (u.role != ROLE.ADMIN) {
            throw new Error("Require Admin Role");
        }
        const songs = getAllSongAndId(sheetName);
        return SongService.updateSingleSongs(songs);
    }

    admin_processSheet(sheetName, session) {
        try {
            const u = UsersService.getUser(session.user.username);
            if (u.role != ROLE.ADMIN) {
                throw new Error("Require Admin Role");
            }
            process(sheetName);
        } catch (e) {
            return `${sheetName} failed, ${e}`;
        }
        return `${sheetName} success`;
    }
}
