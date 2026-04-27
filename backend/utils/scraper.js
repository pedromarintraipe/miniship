async function scrapeCifraClub(cancionUrl) {
  try {
    const response = await fetch(cancionUrl);
    if (!response.ok) throw new Error(`Error en CifraClub: ${response.status}`);
    const html = await response.text();
    
    const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
    if (!preMatch) throw new Error('No se pudo encontrar la letra/acordes.');
    
    let contenido = preMatch[1];

    // Título en CifraClub suele estar en <h1 class="t1">
    const titleMatch = html.match(/<h1[^>]*class=['"]t1['"][^>]*>([^<]+)<\/h1>/i) || html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    let title = titleMatch ? titleMatch[1].trim() : '';

    // Artista en CifraClub suele estar en <h2 class="t3"><a...>...</a></h2>
    const artistMatch = html.match(/<h2[^>]*class=['"]t3['"][^>]*>.*?<a[^>]*>([^<]+)<\/a>/i) || html.match(/class="t1"[^>]*>([^<]+)<\/a>/i);
    let artist = artistMatch ? artistMatch[1].trim() : '';

    // Soporte de respaldo basado en URL para CifraClub
    if (!title || !artist) {
      const urlParts = getMetadataFromUrl(cancionUrl);
      if (!title) title = urlParts.title;
      if (!artist) artist = urlParts.artist;
    }

    const noSpaceHtml = html.replace(/\s+/g, ' ');
    const keyMatch = noSpaceHtml.match(/id="cifra_tom".*?<a[^>]*>\s*([A-G][b#]?[\w]*)\s*<\/a>/i) || noSpaceHtml.match(/(?:Tom|Tonalidad):\s*<a[^>]*>\s*([A-G][b#]?[\w]*)\s*<\/a>/i);
    let key = keyMatch ? keyMatch[1].trim() : '';
    
    contenido = cleanHtml(contenido);
    if (!key) key = detectKeyFromText(contenido);
    contenido = contenido.replace(/(?:Tom|Tono|Tonalidad):\s*[A-G][b#]?[\w]*\s*/i, '');

    return { rawText: contenido.trim(), title, artist, originalKey: key };
  } catch (error) {
    throw error;
  }
}

async function scrapeLaCuerda(cancionUrl) {
  try {
    const response = await fetch(cancionUrl);
    if (!response.ok) throw new Error(`Error en LaCuerda: ${response.status}`);
    const html = await response.text();
    
    const titleMatch = html.match(/<h1[^>]*>.*?<a[^>]*>([^<]+)<\/a>/i);
    let title = titleMatch ? titleMatch[1].trim() : '';

    const artistMatch = html.match(/<h2[^>]*>.*?<a[^>]*>([^<]+)<\/a>/i);
    let artist = artistMatch ? artistMatch[1].trim() : '';

    if (!title || !artist) {
      const urlParts = getMetadataFromUrl(cancionUrl);
      if (!title) title = urlParts.title;
      if (!artist) artist = urlParts.artist;
    }

    const allPres = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi) || [];
    let contenido = "";
    for (const p of allPres) {
      const inner = p.replace(/<pre[^>]*>|<\/pre>/gi, '').trim();
      if (inner.length > 50) {
        contenido = inner;
        break;
      }
    }

    if (!contenido) throw new Error('No se encontró el bloque de letra/acordes.');

    contenido = contenido.replace(/<a[^>]*>([^<]+)<\/a>/gi, '$1');
    contenido = cleanHtml(contenido);
    let key = detectKeyFromText(contenido);

    return { 
      rawText: contenido.trim(), 
      title: title.replace(/ acordes$/i, ''), 
      artist, 
      originalKey: key 
    };
  } catch (error) {
    throw error;
  }
}

function getMetadataFromUrl(urlStr) {
  try {
    const urlObj = new URL(urlStr);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return {
        artist: parts[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        title: parts[1].split('.')[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      };
    }
  } catch (e) {}
  return { title: '', artist: '' };
}

function cleanHtml(text) {
  return text.replace(/<[^>]*>/g, '')
             .replace(/&quot;/g, '"')
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&#39;/g, "'");
}

function detectKeyFromText(text) {
  const match = text.match(/(?:Tom|Tono|Tonalidad|Acorde de):\s*([A-G][b#]?[\w]*)/i);
  return match ? match[1].trim() : 'C';
}

async function scrapeUrl(url) {
  if (url.includes('lacuerda.net')) {
    return scrapeLaCuerda(url);
  } else if (url.includes('cifraclub.com')) {
    return scrapeCifraClub(url);
  } else {
    throw new Error('Dominio no soportado.');
  }
}

module.exports = { scrapeUrl };
