async function scrapeCifraClub(cancionUrl) {
  try {
    const response = await fetch(cancionUrl);
    
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // CifraClub guarda la letra y acordes dentro de un tag <pre> 
    const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
    
    if (!preMatch) {
      throw new Error('No se pudo encontrar la letra/acordes en la página.');
    }
    
    let contenido = preMatch[1];
    
    // Extraer título natural si es posible (<h1>)
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    let title = titleMatch ? titleMatch[1].trim() : '';

    const artistMatch = html.match(/<h2><a[^>]*>([^<]+)<\/a><\/h2>/i) || html.match(/class="t1"[^>]*>([^<]+)<\/a>/i);
    let artist = artistMatch ? artistMatch[1].trim() : '';
    if (!artist) {
      try {
        const parts = new URL(cancionUrl).pathname.split('/').filter(Boolean);
        if (parts.length > 0) artist = parts[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      } catch (e) {}
    }

    const noSpaceHtml = html.replace(/\s+/g, ' ');
    const keyMatch = noSpaceHtml.match(/id="cifra_tom".*?<a[^>]*>\s*([A-G][b#]?[\w]*)\s*<\/a>/i) || noSpaceHtml.match(/(?:Tom|Tonalidad):\s*<a[^>]*>\s*([A-G][b#]?[\w]*)\s*<\/a>/i);
    let key = keyMatch ? keyMatch[1].trim() : '';
    
    // Limpiamos etiquetas HTML
    contenido = contenido.replace(/<[^>]*>/g, '');
    contenido = contenido.replace(/&quot;/g, '"')
                         .replace(/&amp;/g, '&')
                         .replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&#39;/g, "'");

    if (!key) {
      const textKeyMatch = contenido.match(/(?:Tom|Tono|Tonalidad):\s*([A-G][b#]?[\w]*)/i);
      if (textKeyMatch) {
         key = textKeyMatch[1].trim();
      } else {
         key = 'C';
      }
    }

    // Remover el Tono de la letra para que no se duplique
    contenido = contenido.replace(/(?:Tom|Tono|Tonalidad):\s*[A-G][b#]?[\w]*\s*/i, '');

    return { rawText: contenido.trim(), title, artist, originalKey: key };
    
  } catch (error) {
    throw new Error('Ocurrió un error al intentar extraer los datos: ' + error.message);
  }
}

module.exports = { scrapeCifraClub };
