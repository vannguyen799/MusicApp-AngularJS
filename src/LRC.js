class LyricLRC {
    constructor(lyricString) {
        // console.log("updatelrc");
        const lines = lyricString.split('\n')
        const lineRegex = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{2,3}))?\]\s?(.*)/;
        const offsetRegex = /\[offset:(.*?)\]/
        this.lyrics = {
            offset: 0,
            data: []
        }

        const lyrics = []
        /// read LRC
        for (const [i, line] of lines.entries()) {
            let l;

            if ((l = line.match(lineRegex))) {
                lyrics.push({
                    startTime: parseInt(l[1]) * 60 + parseInt(l[2]) + parseInt('0' + l[3]),
                    text: l[4].trim()
                })
            }

            if (l = line.match(offsetRegex)) {
                this.lyrics.offset = l[1] / 1000
            }
        }

        lyrics.map((lyric, i) => {
            if (i < lyrics.length - 1) {
                lyric.endTime = lyrics[i + 1].startTime
            }
        })

        this.lyrics.data = lyrics
        this.getLyrics_lastIndex = 0
    }

    getLyrics(timeAt) {
        timeAt += this.lyrics.offset
        const data = this.lyrics.data
        for (let i = this.getLyrics_lastIndex % data.length; i < data.length; i++) {
            let lyric = data[i]
            if (timeAt < lyric.startTime) {
                return false
            } else {
                this.getLyrics_lastIndex++

                return lyric.text
            }
        }
    }
}