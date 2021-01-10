const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function fetchPage(urls, rootDir) {
  const url = urls.shift();
  console.log('\n[FETCH PAGE] ', url);

  try {
    const response = await fetch(url);
    const text = await response.text();
    const $ = cheerio.load(text);
    const title = $('.post-title').text().trim();
    const path = rootDir + title;
    const imgUrls = [];

    $('.separator img').each((_, el) => imgUrls.push(el.attribs.src));

    console.log(`Title: ${title}\nCount: ${imgUrls.length}`);
    fs.mkdirSync(path, { recursive: true });
    // await fetchImage(imgUrls, 0, path);
    await fetchImages(imgUrls, path);
  } catch (e) {
    console.error(e);
  }

  if (urls.length > 0) await fetchPage(urls, rootDir);
}

async function fetchImage(urls, index = 0, path = '') {
  const url = urls.shift();
  const filename = `${path}/${index}.jpg`;

  const isExists = fs.existsSync(filename);

  if (isExists) {
    console.log(`${index}.jpg exists. Skipping...`);
  } else {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buf = Buffer.from(arrayBuffer);

      console.log(`Downloading ${index}.jpg`);

      fs.writeFileSync(filename, buf);
    } catch (e) {
      console.error(e);
    }
  }

  if (urls.length > 0) await fetchImage(urls, index + 1, path);
}

async function fetchImages(urls, path) {
  const promises = urls.map(function (url, index) {
    return new Promise(async (resolve, reject) => {
      const filename = `${path}/${index}.jpg`;
      const isExists = fs.existsSync(filename);

      if (isExists) {
        console.log(`${index}.jpg exists. Skipping...`);
      } else {
        try {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const buf = Buffer.from(arrayBuffer);

          console.log(`Downloading ${index}.jpg`);

          fs.writeFileSync(filename, buf);
        } catch (e) {
          console.error(e);
          reject(e);
        }
      }
      resolve();
    });
  });

  await Promise.allSettled(promises);
}

module.exports = fetchPage;
