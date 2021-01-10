const url = require('url');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fetchPage = require('./fetchPage');

async function main(src) {
  console.log('[STARTING]');

  const urlParsed = url.parse(src);
  const paths = decodeURI(urlParsed.pathname).split('/');
  const rootDir = `out/${paths[paths.length - 1]}/`;

  try {
    console.log('Entry Point: ', src);
    const response = await fetch(src);
    const text = await response.text();
    const $ = cheerio.load(text);
    const links = [];

    $('.post-title a').map((_, a) => links.push(a.attribs.href));
    if (links.length > 0) {
      await fetchPage(links, rootDir);
    }
    console.log('[DONE]');

    const next = $('#Blog1_blog-pager-older-link');

    if (next && next[0] && next[0].attribs.href) {
      console.log('Next Page Found');
      await main(next[0].attribs.href);
    }
  } catch (e) {
    console.log('[ERROR]', e.message);
  }
}

const src = process.argv[2];

if (!src) {
  console.log('URL is empty');
  process.exit(-1);
}

main(src);
