const { scrapeCifraClub } = require('./utils/scraper');
const { parseRawSongText } = require('./utils/parser');

async function test() {
  try {
    const data = await scrapeCifraClub('https://www.cifraclub.com/marcos-witt/tu-fidelidad/');
    console.log("Scraped data keys:", Object.keys(data));
    const parsed = parseRawSongText(data.rawText);
    console.log("Parsed sections:", parsed.sections.length);
    console.log("First section first line:", parsed.sections[0].lines[0]);
  } catch(e) {
    console.error(e);
  }
}
test();
