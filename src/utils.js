function extractFileId(url) {
  try {
    const match = url.match(/\/d\/(.+?)\//);
    if (match && match[1] && isDriveId(match[1])) return match[1];
  } catch (e) {
    return null
  }
  return null
}

function isDriveId(id) {
  return /^[a-zA-Z0-9-_]{33}$/.test(id)
}

function isAudioMimeType(mimeType) {
  return mimeType.startsWith('audio') || mimeType == 'application/x-flac'
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


function instanceOf(constructor, args) {
  // hmm TODO
  if (args) {
    return new constructor(...args)
  }
  if (!constructor.__instance__) {
    constructor.__instance__ = new constructor()
  }
  return constructor.__instance__
}


Array.prototype.popFilter = function (_q) {
  let r = []
  for (const e of this) {
    if (_q(e)) {
      r.push(e)
      this.splice(this.indexOf(e), 1)
      return e
    }
  }

}

/* Source: https://gist.github.com/erickoledadevrel/6b1e9e2796e3c21f669f */
/**
 * Converts an XML string to a JSON object, using logic similar to the
 * sunset method Xml.parse().
 * @param {string} xml The XML to parse.
 * @returns {Object} The parsed XML.
 */

function xmlToJSON(xml) {
  var doc = XmlService.parse(xml);
  var result = {};
  var root = doc.getRootElement();
  result[root.getName()] = elementToJSON(root);
  // console.log(JSON.stringify(result))
  return result;
}

/**
 * Converts an XmlService element to a JSON object, using logic similar to
 * the sunset method Xml.parse().
 * @param {XmlService.Element} element The element to parse.
 * @returns {Object} The parsed element.
 */
function elementToJSON(element) {
  var result = {};
  // Attributes.
  element.getAttributes().forEach(function (attribute) {
    result[attribute.getName()] = attribute.getValue();
  });
  // Child elements.
  element.getChildren().forEach(function (child) {
    var key = child.getName();
    var value = elementToJSON(child);
    if (result[key]) {
      if (!(result[key] instanceof Array)) {
        result[key] = [result[key]];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  });
  // Text content.
  if (element.getText()) {
    result['Text'] = element.getText();
  }
  return result;
}

function languageIs(text) {
  return {
    chinese: /[\u4e00-\u9fa5]/.test(text),
    english: /[A-Za-z]/.test(text),
    vietnamese: /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)
  };
}

function translate(lrcText) {
  for (const line of lrcText.split('\n')) {
    if (line.startsWith('[00:')) {
      let lang = languageIs(line)
      if (lang.chinese) {
        return {
          language: 'chinese',
          lrc: `[translate:Google]\n${LanguageApp.translate(lrcText, 'zh', 'vi')}`
        }
      } else {
        if (lang.english) {
          return {
            language: 'english',
            lrc: `[translate:Google]\n${LanguageApp.translate(lrcText, 'en', 'vi')}`
          }
        } else if (lang.vietnamese) {
          return {
            language: 'vietnamese',
            lrc: lrcText
          }
        }
      }
      return lrcText
    }
  }
}


function chineseNameParse() {
  const allSongs = SongService.instance.getSongs('Chinese')
  const songNameMap = {}
  const singerMap = {}
  for (const song of allSongs) {
    if (song.vname && song.name && song.name != song.vname) {
      let nameKey = song.name.split('(')[0].trim()
      if (song.vname != nameKey) {
        songNameMap[nameKey] = song.vname
      }
    }
    if (song.vsinger && song.singer && song.vsinger != song.singer) {
      singerMap[song.singer] = song.vsinger
    }
  }

  /**
   * Convert a singer string in the format of 'A & B' to 'A,B'
   * @param {string} singer - The singer string
   * @returns {string} The converted string
   */
  function convertSinger(singer) {
    const singers = singer
      .replace(/&|，|\//g, ',')
      .split(',').map(s => s.trim())
    const vsinger = []
    for (const s of singers) {
      vsinger.push(singerMap[s] || s)
    }
    if (vsinger.join(', ') !== singers.join(', ')) {
      return vsinger.join(', ')
    }
  }

  /** @param {string} name @returns {string|false}   */
  function convertName(name) {
    const [mainName, ...subName] = name.split('(')
    return songNameMap[mainName.trim()] ? songNameMap[mainName.trim()] + (subName.length > 0 ? ` (${subName.join(' (')}` : '') : false
  }

  for (const song of allSongs) {
    if (!song.vname || !song.vsinger) {
      let updated = false
      if (!song.vname) {
        song.vname = convertName(song.name) || ''
        if (song.vname === song.name) {
          song.vname = ''
        } else {
          updated = true
        }
      }
      if (!song.vsinger) {
        song.vsinger = convertSinger(song.singer) || ''
        if (song.vsinger === song.singer) {
          song.vsinger = ''
        } else {
          updated = true
        }
      }
      if (updated) {
        console.log(SongService.instance.updateSong(song)
        )
      }
    }
  }
}
