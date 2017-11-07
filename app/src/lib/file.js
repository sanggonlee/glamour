/**
 * Load the XML file and returns a promise resolving to
 * the file content in XML Document object.
 * @param {String} filename 
 */

export function loadXML(filename) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filename, true);
    xhr.onload = (e) => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseXML);
        } else {
          reject('Failed read the dom tree XML file');
        }
      }
    }
    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send(null);
  });
}
