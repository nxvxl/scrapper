const fetch = require('node-fetch');
const fs = require('fs');

async function writeImage(url, path) {
  console.log('Path: ', path);
  try {
    console.log('Fetching image');
    const response = await fetch(url);
    const arrBuf = await response.arrayBuffer();

    const buf = Buffer.from(arrBuf);
    fs.writeFileSync(path, buf);
    console.log('Finish writing');
  } catch (e) {
    console.error(e);
  }
}

module.exports = writeImage;
