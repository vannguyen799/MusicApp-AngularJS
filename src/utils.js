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

function updateFlacMimeType() {
  let names = getAllSheetName()
  for (const n of names) {
    let ins = new SongFileManager(n)
    if (ins.validateClass()) {
      console.log('update mimetype ' + n)
      ins.fixRevision()
    }
  }
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