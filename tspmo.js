async function searchResults(keyword) {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const response = await soraFetch(`https://mangakatana.com/?search=${encodedKeyword}&search_by=book_name`);
    const html = await response.text();
    const results = [];
    
    const itemRegex = /<div class="item"[^>]*data-genre="[^"]*"[^>]*data-id="[^"]*"[^>]*>([\s\S]*?)(?=<div class="item"|$)/g;
    
    let itemMatch;
    while ((itemMatch = itemRegex.exec(html)) !== null) {
      const itemHtml = itemMatch[1];
      
      const titleRegex = /<h3 class="title">\s*<a href="([^"]+)"[^>]*>([^<]+)<\/a>/;
      const titleMatch = titleRegex.exec(itemHtml);
      
      if (titleMatch) {
        const title = titleMatch[2].trim();
        const href = titleMatch[1].trim();
        
        if (title && href && 
            !title.includes("'+") && 
            !href.includes("'+") &&
            href.startsWith('http')) {
          results.push({
            title: title,
            href: href
          });
        }
      }
    }
    
    console.log(`Search results for "${keyword}":`, JSON.stringify(results));
    return JSON.stringify(results);
  } catch (error) {
    console.log('Fetch error in searchResults:', error);
    return JSON.stringify([{ title: 'Error', href: '' }]);
  }
}

async function extractDetails(url) {
  try {
    const response = await soraFetch(url);
    const htmlText = await response.text();

    const descMatch = htmlText.match(/<div class="label">Description<\/div>\s*<p>([\s\S]*?)<\/p>/);

    let description = 'No description available';
    if (descMatch && descMatch[1]) {
      description = descMatch[1]
        .replace(/<[^>]+>/g, '')  
        .replace(/\s+/g, ' ')     
        .trim();
    }

    const transformedResults = [{
      description,
      aliases: 'N/A',
      airdate: 'N/A'
    }];

    console.log(`Details for "${url}":`, JSON.stringify(transformedResults));
    return JSON.stringify(transformedResults);
  } catch (error) {
    console.log('Details error:', error);
    return JSON.stringify([{
      description: 'Error loading description',
      aliases: 'N/A',
      airdate: 'N/A'
    }]);
  }
}

async function extractChapters(url) {
    try {
        const response = await soraFetch(url);
        const htmlText = await response.text();

        const chapterRegex = /<tr data-jump="0">[\s\S]*?<a href="([^"]+)">([\s\S]*?)<\/a>[\s\S]*?<\/tr>/g;
        const chapters = [];

        let match;
        while ((match = chapterRegex.exec(htmlText)) !== null) {
            const href = match[1].trim();
            const titleMatch = /Chapter \d+[:\s]?.*/i.exec(match[2]); 
            const title = titleMatch ? decodeHtmlEntities(titleMatch[0].trim()) : "Unknown Chapter";
            const numberMatch = /Chapter (\d+)/i.exec(title);
            const number = numberMatch ? parseInt(numberMatch[1]) : NaN;

            chapters.push({
                number: number === 0 ? 1 : number,
                href: href.startsWith("http") ? href : "https://mangakatana.com" + href,
                title: title
            });
        }

        chapters.reverse();

        console.log(JSON.stringify(chapters));
        return chapters;
    } catch (error) {
        console.error('Fetch error in extractChapters:', error);
        return [];
    }
}
async function extractText(url) {
  try {
    const response = await soraFetch(url);
    const htmlText = await response.text();
    
    const thzqMatch = htmlText.match(/var\s+thzq\s*=\s*\[(.*?)\];/s);
    if (!thzqMatch) throw new Error("thzq array not found");
    
    const arrayContent = thzqMatch[1];
    
    const thzq = arrayContent
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => {
        return item.replace(/^['"]|['"]$/g, '');
      });
    
    const chapterMatch = url.match(/c(\d+\.?\d*)/i);
    const chapterNumber = chapterMatch ? chapterMatch[1] : "Unknown";
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Chapter ${chapterNumber} - Blue Box</title>
  <style>
    body {
      margin: 0; 
      padding: 0; 
      background: #000;
    }
    img {
      display: block;
      width: 100vw;
      height: auto;
      max-width: 100%;
      margin: 0;
    }
  </style>
</head>
<body>
${thzq.map(src => `  <img src="${src.trim()}" alt="Page image" />`).join('\n')}
</body>
</html>
    `.trim();
    
    console.log(html);
    return html;
    
  } catch (error) {
    console.error("❌ Error in extractText:", error);
    return `<p>Error loading chapter images: ${error.message}</p>`;
  }
}
function decodeHtmlEntities(str) {
    const named = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
        nbsp: ' ',
        hellip: '…',
        rsquo: '’',
        lsquo: '‘',
        ndash: '–',
        mdash: '—'
    };

    return str
        .replace(/&([a-z]+);/gi, (match, name) => named[name] || match)
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code));
}


async function soraFetch(url, options = { headers: {}, method: 'GET', body: null }) {
    try {
        return await fetchv2(url, options.headers ?? {}, options.method ?? 'GET', options.body ?? null);
    } catch(e) {
        try {
            return await fetch(url, options);
        } catch(error) {
            return null;
        }
    }
}
