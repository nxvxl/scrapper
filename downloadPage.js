const fetchPage = require('./fetchPage');

async function main() {
  const url = process.argv[2];
  const dir = process.argv[3] || '';

  if (!url) return process.exit(-1);

  await fetchPage([url], dir);

  return 0;
}

main();
