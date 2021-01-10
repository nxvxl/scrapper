/* eslint-disable no-await-in-loop */
const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const writeImage = require('./imageWriter');

const out = 'out/';

async function main() {
  console.log('starting');
  fs.mkdirSync('out/', { recursive: true });

  try {
    console.log('fetch label');
    const response = await fetch('https://idol.gravureprincess.date/search/label/Takeda%20Rena');

    const text = await response.text();

    const $ = cheerio.load(text);

    const links = [];
    $('.post-title a').map((_, a) => links.push(a.attribs.href));
    // eslint-disable-next-line no-restricted-syntax
    for (const link of links) {
      const pages = await fetch(link);
      const html = await pages.text();
      const $html = cheerio.load(html);
      const title = $html('title').text().split(', ');
      const name = title[0];
      const magazine = title[1].split(' - ')[0];
      const dir = `${out}${name}/${magazine}`;

      fs.mkdirSync(dir, { recursive: true });

      $html('.separator img').each(async (i, img) => {
        const imgUrl = img.attribs.src;
        const path = `${dir}/${i}.jpg`;
        await writeImage(imgUrl, path);
      });
    }
  } catch (e) {
    console.error(e);
  }

  console.log('done');
}

main();
