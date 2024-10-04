function t() {
  let ss = JSONRPCServer.instance.verifyAuthToken('TFcwOUNhMHBkc3loQnQzcEJ1N0tOMDFmWG16d2VqMlhZWUkzTlFtNzVCWT06OmFkbWluOjow::1728286078574')
  console.log(ss)
}

function testFetchApi() {
  let resp = UrlFetchApp.fetch(ScriptApp.getService().getUrl() + '/getAllSongs')

  console.log(resp.getHeaders())
}

function t2() {
  // console.log(ScriptApp.getOAuthToken())
  //   let a = SpreadsheetApp.getActiveSheet().getRange('a33')
  //   console.log(  a.getFormula() === ''
  // )
  //   console.log(a.getValue())

  for (const name of getAllSheetName()) {
    let b = new SongFileManager(name)
    if (b.validateClass()) {
      // b.trimText()
      b.fixRevision()
    }
  }
}

function testAddFavSong() {
  const fileId = extractFileId('https://drive.google.com/file/d/1-t-YjL6JoAGF8Du4tfp44x2NGmb_0EXM/view?usp=drivesdk')
  let b = new SongFileManager('LanXinYu')
  console.log(b.setSongFavorite(fileId)
  )
}

this.player = {
  audioTimeRanges: [document.querySelector("#audioTimeRange"), document.querySelector("#audioTimeRange-fc")],
  init: function ($scope) {
    const player = this;
    $scope.secToMin = secToMin;
    $scope.$watch(
      () => player.in4.volume.value,
      function (newValue, oldValue) {
        if (newValue !== oldValue) player.setSpeakerValue(newValue);
      },
    );
    $scope.$watch(
      () => this.in4.speed,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          clearTimeout(timer.setPlaybackRateTimer);
          timer.setPlaybackRateTimer = setTimeout(() => player.setPlaybackRate(newValue), 2000);
        }
      },
    );
    for (const e of this.audioTimeRanges) {
      e.addEventListener("change", (event) => {
        console.log(player.in4.current, ">", event.target.value);
        player.audio.currentTime = event.target.value;
      });
    }
  },
  in4: {
    duration: "0",
    current: "0",
    volume: {
      isMuted: false,
      value: 75,
    },
    changeTime: 0,
    speed: 1,
  },
  metadata: {},
  _playlist: [],
  _favlist: [],
  playlist: [],
  prevPlaylist: [],
  favlist: [],
  // audio element
  audio: new Audio(),
  setPlaybackRate(_val) {
    if (_val == player.audio.playbackRate) {
      return;
    }
    this.audio.pause();
    this.audio.playbackRate = parseFloat(_val);
    setTimeout(() => {
      this.audio.play();
    }, 200);
  },
  setSpeakerValue(_val) {
    if (_val && (_val > 0 || _val <= 100)) {
      _val = parseFloat(_val);
      this.audio.volume = _val / 100;
    } else {
      this.audio.volume = 0;
    }
  },
  isPlaying: false,
  generateAudioEvent() {
    this.setSpeakerValue(this.in4.volume.value);
    const audio = this.audio;
    let audioLog = {};
    function updateRange_() { }
    audio.addEventListener("timeupdate", () => {
      this.in4.current = audio.currentTime;
      for (const e of this.audioTimeRanges) {
        e.value = this.in4.current;
      }
      this.updateLyric(this.in4.current);

      if (this.in4.current > 0) {
        this.isPlaying = true;
      }
      // preparing next song

      if (cfg.preload && !this.refresh.rdn && this.in4.current / audio.duration > parseFloat(cfg.preloadRate)) {
        console.log("enter rdns");
        this.refresh.rdn = true;
        this._readyNextSong();
      }

      if (!audioLog.songInfo || audioLog.songInfo.fileId != this.songInfo.fileId) {
        audioLog = {
          songInfo: this.songInfo,
          count: 0,
          lastT: 0,
          done: false,
        };
      } else {
        if (audioLog.songInfo && audioLog.songInfo.fileId == this.songInfo.fileId && audio.currentTime <= 1 && audioLog.lastT > audio.currentTime) {
          audioLog = {
            songInfo: this.songInfo,
            count: 0,
            lastT: 0,
            done: false,
          };
        }
      }
      audioLog.count += audio.currentTime - audioLog.lastT;
      audioLog.lastT = audio.currentTime;
      if (!audioLog.done && audio.duration / 2 < audioLog.count) {
        let s = audioLog.songInfo;
        audioLog.done = true;
        console.log("1viewup");
        ctrl.DataService.addListens(s).then((result) => {
          if (result.fileId) {
            ctrl.tryApply();
          }
        });
        this.songInfo.listens++;
      }
      ctrl.tryApply();
    });
    audio.addEventListener("ended", () => {
      this.next();
      ctrl.tryApply();
    });
    audio.addEventListener("canplay", () => {
      this.in4.duration = audio.duration;
      this.loadMetadata();
      ctrl.tryApply();
    });
    audio.addEventListener("pause", () => {
      this.isPlaying = false;
      ctrl.tryApply();
    });
    // audio.addEventListener("loadedmetadata", function () {
    //     ctrl.tryApply();
    // });
  },
  // current song playing info
  songInfo: undefined,
  coverImgSrc: "",
  currentExt: "",
  defaultCoverImgUrl: "https://i.pinimg.com/736x/5a/e1/58/5ae15822d73ac828599044153fb91fed.jpg",
  isRandomPlay: true,
  loopMode: 0,
  lyricLRCs: {
    origin: undefined,
    vs: undefined,
    es: undefined,
  },
  isFavoriteList: false,
  // set player song list
  setPlaylist(songList) {
    this._playlist = [...songList];
    //set playlist
    this.playlist = [...songList];
    this.prevPlaylist = [];
    this._favList = songList.filter((s) => s.isFavorite);
    this.favList = [...this._favlist];
    this.isOpen = true;
    // this.audio.pause();
  },
  next() {
    this._clearLyric();
    if (this.playlist.length > 0) {
      let rns = this._cache._rns;
      if (rns.songInfo && this.isRandomPlay == rns.random && this.playlist.find((x) => x.fileId == rns.songInfo.fileId)) {
        console.log("play rns");
        this._cache.clearRns(false);

        this.refresh(rns.songInfo, rns.audio);
        return;
      }

      let songIn42Play;
      if (this.isFavoriteList && this.playlist !== this.favlist) {
        this.favlist = [...this._favlist];
        this.playlist = this.favlist;
      } else {
        if (this.playlist === this.favlist) {
          this.playlist = [...this._playlist];
        }
      }
      if (this.loopMode != 0 && this.songInfo) {
        console.log("play loop");

        this.audio.currentTime = 0;
        this.audio.play();
        if (this.loopMode == 1) {
          this.loopMode = 0;
        }
        return;
      }
      if (this.isRandomPlay) {
        songIn42Play = popRandomElement(this.playlist);
      } else {
        songIn42Play = this.playlist.pop();
      }
      if (songIn42Play) {
        console.log("play df");

        this.refresh(songIn42Play);
        this.prevPlaylist.push(songIn42Play);
      }
    }
  },
  prev() {
    let { current, duration } = this.in4;
    if (current > 10) {
      this.restart();
      return;
    }
    if (this.prevPlaylist.length > 0) {
      this.refresh(this.prevPlaylist.pop());
    }
  },
  _clearLyric() {
    document.getElementById("lyric").innerHTML = "";
    document.getElementById("supLyric").innerHTML = "";
    document.getElementById("vnLyric").innerHTML = "";
    document.getElementById("enLyric").innerHTML = "";
  },
  // play button handler
  play(s) {
    this.refresh(s);
  },
  restart() {
    this.audio.currentTime = 0;
    this.audio.play();
  },
  updateLyric(timeAt = 0) {
    timeAt = parseFloat(timeAt) + 0.25;
    const { origin, es, vs } = this.lyricLRCs;
    try {
      let originSub = origin?.getLyrics(timeAt, ctrl.config.lyricAutoTranslate),
        vietsub = vs?.getLyrics(timeAt, ctrl.config.lyricAutoTranslate),
        engsub;
      if (originSub) {
        document.getElementById("lyric").innerHTML = originSub;
        try {
          if (/[\u4e00-\u9fff]/.test(originSub)) {
            document.getElementById("supLyric").innerHTML = originSub
              .split(".")
              .map((s) => {
                return s
                  .split(",")
                  .map((_s) => {
                    return pinyin
                      .pinyin(_s, {
                        segment: true, // 启用分词
                        group: true, // 启用词组
                      })
                      .map((p) => p[0])
                      .join(" ");
                  })
                  .join(", ")
                  .trim();
              })
              .join(". ")
              .trim();
          } else {
            document.getElementById("supLyric").innerHTML = "";
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        document.getElementById("lyric").innerHTML = "";
        document.getElementById("supLyric").innerHTML = "";
      }
      document.getElementById("vnLyric").innerHTML = vietsub && vietsub != originSub ? vietsub : "";
    } catch (e) {
      // this._clearLyric
      console.log("update lyric err", e);
    }
  },
  // reset playlist
  resetPlaylist() {
    this.playlist = [...this._playlist];
    this.favList = [...this._favlist];
    this.prevPlaylist = [];
  },
  _cache: {
    _rns: {},
    _rnsWk: false,
    clearRns(revoke = true) {
      try {
        if (revoke && this._rns.url) {
          // URL.revokeObjectURL(this._rns.url);
        }
      } catch (e) {
        console.log(e);
      }
      this._rns = {};
      this._rnsWk = false;
    },
  },
  _readyNextSong() {
    this._readyNextSong.idx = this._readyNextSong + 1 || 1;
    let idx = this._readyNextSong.idx;
    this._cache._rnsWk = true;
    if (this.loopMode > 0) {
      return;
    }
    if (this.playlist.length > 0) {
      let songIn42Play;
      if (this.isFavoriteList && this.playlist !== this.favlist) {
        this.favlist = [...this._favlist];
        this.playlist = this.favlist;
      } else {
        if (this.playlist === this.favlist) {
          this.playlist = [...this._playlist];
        }
      }
      if (this.isRandomPlay) {
        songIn42Play = this.playlist[Math.floor(Math.random() * this.playlist.length)];
      } else {
        songIn42Play = this.playlist[this.playlist.length - 1];
      }
      if (songIn42Play) {
        // console.log("ppfor ", songIn42Play);
        /// ready
        this._cache.clearRns(false);
        return (
          ctrl.MSService.getAudioSource(songIn42Play.fileId)
            // // let url = "https://www.googleapis.com/drive/v3/files/" + songIn42Play.fileId;
            // return fetch(url + "?alt=media&key=" + ctrl.selectKeyA_())
            //     .then((response) => response.blob())
            .then((blob) => {
              // console.log("rdn");
              let url = URL.createObjectURL(blob);
              let audio = new Audio(url);
              if (this._readyNextSong.idx != idx) return;
              return (this._cache._rns = {
                songInfo: songIn42Play,
                audio: audio,
                url: url,
                blob: blob,
                random: this.isRandomPlay,
              });
            })
            .catch((err) => {
              // this._cache._rnsWk = false;
              console.log(err);
            })
        );
      }
    }
  },
  // set songinfo and play
  refresh(songInfo, audio) {
    if (ctrl.isReady()) {
      let rfs = this.refresh.rfs ?? 0;
      this.refresh.rfs = rfs;
      this.refresh.playIndex = this.refresh.playIndex || 0;
      const currentIndex = this.refresh.playIndex + 1;
      this.refresh.playIndex = currentIndex;
      try {
        if (songInfo.fileId == this._cache._rns.songInfo.fileId) {
          audio = this._cache._rns.audio;
        }
      } catch (e) { }

      this.songInfo = songInfo;
      this.currentExt = "";
      this.coverImgSrc = "";
      this.in4.current = 0;
      this.in4.duration = 0;
      this.audio?.pause();
      this.audio?.remove();
      this.audio = new Audio("");
      this._clearLyric();
      if (audio) {
        this.refresh.rfs += 1;
        if (this.refresh.playIndex != currentIndex) return;

        this.lyricLRCs = {
          origin: new LyricLRC(songInfo.lyric),
          vs: new LyricLRC((songInfo.lyric_vn == "" || !songInfo.lyric_vn) && songInfo.lyric_vn_translated ? songInfo.lyric_vn_translated : songInfo.lyric_vn),
          // es: new LyricLRC(song.songInfo.lyric_en),
        };
        this.audio = audio;
        this.audio.title = this.mainSongName || this.subSongName;
        this.generateAudioEvent();
        this.audio.load();
        this.audio.play();
        this.refresh.rdn = false;
        this._cache._rnsWk = false;
        for (const [i, url] of urlRvk.entries()) {
          if (url != audio.src) {
            try {
              URL.revokeObjectURL(url);
              urlRvk.slice(i, 1);
            } catch (e) {
              console.log(e);
            }
          }
        }
        urlRvk.push(audio.src);
      } else {
        clearTimeout(timer.loadSongAudioTimer);
        timer.loadSongAudioTimer = setTimeout(() => {
          ctrl.MSService.getAudioSource(songInfo.fileId)
            // fetch(this.audioSrc)
            //     .then((response) => response.blob())
            .then((blob) => {
              if (rfs != this.refresh.rfs) {
                return blob;
              }
              this._cache.clearRns();
              let url = URL.createObjectURL(blob);
              let audio = new Audio(url);
              this._cache._rns = {
                // songInfo: songInfo,
                blob: blob,
                audio: audio,
                url: url,
              };
              this.refresh(songInfo, audio);
              ctrl.tryApply();
            });
        }, 2000);
      }
    }
  },
  playHandler(s, p) {
    if (p) this.setPlaylist(p);
    if (!s) {
      if (this.songInfo) {
        if (this.audio.paused) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      } else {
        this.next();
      }
    } else {
      if (this.songInfo && s.fileId == this.songInfo.fileId) {
        if (this.audio.paused) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      } else {
        this.play(s);
      }
      return;
    }
  },
  speakerBtnHandle(value) {
    this.in4.volume.isMuted = !this.in4.volume.isMuted;
    if (!this.in4.volume.isMuted) {
      this.setSpeakerValue(this.in4.volume.value);
    } else {
      this.audio.volume = 0;
    }
  },
  loadMetadata() {
    const player = this;
    function processblob(blob) {
      jsmediatags.read(blob, {
        onSuccess: function (tag) {
          player.currentExt = mimeTypeToExt(blob.type);
          const tags = tag.tags;
          const picture = tags.picture;
          console.log(tags);
          if (picture) {
            player.coverImgSrc = "data:" + picture.format + ";base64," + arrayBufferToBase64(picture.data);
            ctrl.tryApply();
          } else {
          }
        },
        onError: function (error) {
          console.log("err: " + JSON.stringify(error));
        },
      });
    }
    fetch(player.audio.src)
      .then((response) => response.blob())
      .then((blob) => {
        processblob(blob);
      })
      .catch((error) => {
        console.error("Error fetching the file:", error);
      });
    return;
  },
  get mainSongName() {
    try {
      return this.songInfo.name == "" ? "" : `${this.songInfo.singer} - ${this.songInfo.name}`;
    } catch (e) {
      return "";
    }
  },



};

class PlayerController {
  constructor() { }

  get subSongName() {
    try {
      return this.songInfo.vname == "" ? "" : `${this.songInfo.vsinger} - ${this.songInfo.vname}`;
    } catch (e) {
      return "";
    }
  }
  hideFc() {
    closeAllPopover();
    document.getElementById("player-fc").style.display = "none";
  }
  showFc() {
    closeAllPopover();
    document.getElementById("player-fc").style.display = "block";
  }
}