function extractFileId(url) {
  try {
    const match = url.match(/\/d\/(.+?)\//);
    if (match && match[1]) {
      return match[1];
    }
  } catch (e) {
    return null
  }
  return null
}


function selectDriveAPIKey() {
  let i = PropertyScope.getProperty(properties.ldrvkeyuse)
  if (i == null || i == '' || parseInt(i) >= driveApiKey.length) {
    i = 0
  } else {
    i = parseInt(i) + 1
  }
  PropertyScope.setProperty(properties.ldrvkeyuse, i.toString())
  return driveApiKey[i] ?? driveApiKey[0]
}

function lyricFrom(url = '') {
  console.log(url)
  if (url.startsWith('https://www.kugeci.com/song/')) {
    let html = UrlFetchApp.fetch(url).getContentText()
    const $ = Cheerio.load(html);
    let lyric = $("#lyricsContainer").html().replace('<br/>', '<br>').split('<br>')
    return [`[src:${url}]`, '', ...lyric].map(s => s.trim()).join('\n').trim()
  }
  return ''
}

function lyric(url) {
  return lyricFrom(url)
}

function searchLyric(name, singer) {
  console.log(name, singer)
  // kugeci.com
  let html = UrlFetchApp.fetch(`https://www.kugeci.com/search?q=${name.trim()}`).getContentText()
  let $ = Cheerio.load(html)
  let songs = []
  $("#tablesort tbody tr").each((i, tr) => {
    console.log($(tr).text())
    let td = $(tr).find('td')

    songs.push({
      name: td.eq(1).find('a').text().trim(),
      singer: td.eq(2).find('a').text().trim(),
      url: td.eq(1).find('a').attr('href').trim()
    })


  })
  function compareSinger(s1, s2 = '') {
    let _s1 = s1.replace('，', ',').split(',')
    for (const s of _s1) {
      if (!s2.includes(s.trim())) {
        return false
      }
    }
    return true
  }
  for (const s of songs) {
    console.log(s)
    if (s.name == name && compareSinger(singer, s.singer)) {
      return lyricFrom(s.url)
    }
  }
  return ''
}