async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const responseText = await cloudflareFetch(`https://novellive.app/book/the-innkeeper/chapter-1-a-shooting-star-and-a-wish`);
        const data = await responseText.text();
        console.log(data);
        return null;
    } catch (error) {
        console.log('Fetch error in searchResults:', error);
        return JSON.stringify([{ title: 'Error', image: '', href: '' }]);
    }
}

async function extractDetails(url) {
    try {
        const response = await soraFetch(url);
        const htmlText = await response.text();

        // Extract description
        const descriptionMatch = htmlText.match(/<p class="description">([\s\S]*?)<\/p>/);
        const description = descriptionMatch ? descriptionMatch[1].trim() : 'No description available';

        // Author(s)
        const authorMatch = htmlText.match(/<div class="author">[\s\S]*?<span>Author:<\/span>([\s\S]*?)<\/div>/);
        let authors = 'Unknown';
        if (authorMatch) {
            const authorRegex = /<span itemprop="author">([^<]+)<\/span>/g;
            const authorList = [];
            let aMatch;
            while ((aMatch = authorRegex.exec(authorMatch[1])) !== null) {
                authorList.push(aMatch[1].trim());
            }
            authors = authorList.join(', ');
        }

        // Rank
        const rankMatch = htmlText.match(/<div class="rank"><i class="icon-crown"><\/i>\s*<strong>RANK (\d+)<\/strong>/);
        const rank = rankMatch ? rankMatch[1] : 'Unknown';

        // Rating
        const ratingMatch = htmlText.match(/<strong class="nub">([\d.]+)<\/strong>/);
        const rating = ratingMatch ? ratingMatch[1] : 'Unknown';

        // Chapters
        const chaptersMatch = htmlText.match(/<i class="icon-book-open"><\/i>\s*(\d+)\s*<\/strong><small>Chapters<\/small>/);
        const chapters = chaptersMatch ? chaptersMatch[1] : 'Unknown';

        // Views
        const viewsMatch = htmlText.match(/<i class="icon-eye"><\/i>\s*([\d.,Kk]+)\s*<\/strong><small>Views<\/small>/);
        const views = viewsMatch ? viewsMatch[1] : 'Unknown';

        // Status
        const statusMatch = htmlText.match(/<strong class="completed">([^<]+)<\/strong>\s*<small>Status<\/small>/);
        const status = statusMatch ? statusMatch[1] : 'Unknown';

        // Genres
        const genresMatch = htmlText.match(/<div class="categories">[\s\S]*?<ul>([\s\S]*?)<\/ul>/);
        let genres = 'Unknown';
        if (genresMatch) {
            const genreRegex = /<a [^>]+title="([^"]+)"[^>]*>/g;
            const genreList = [];
            let gMatch;
            while ((gMatch = genreRegex.exec(genresMatch[1])) !== null) {
                genreList.push(gMatch[1].trim());
            }
            genres = genreList.join(', ');
        }

        const aliases = `
Author(s): ${authors}
Rank: ${rank}
Rating: ${rating}
Chapters: ${chapters}
Views: ${views}
Status: ${status}
Genres: ${genres}
        `.trim();

        const transformedResults = [{
            description,
            aliases,
            airdate: ''
        }];

        console.log(JSON.stringify(transformedResults));
        return JSON.stringify(transformedResults);
    } catch (error) {
        console.log('Details error:', error);
        return JSON.stringify([{
            description: 'Error loading description',
            aliases: 'Unknown',
            airdate: ''
        }]);
    }
}

async function extractChapters(url) {
    try {
        const response = await soraFetch(url);
        const htmlText = await response.text();

        const chaptersMatch = htmlText.match(/<i class="icon-book-open"><\/i>\s*(\d+)\s*<\/strong><small>Chapters<\/small>/);
        const chaptersNumber = chaptersMatch ? chaptersMatch[1] : 'Unknown';

        let chapters = [];

        for (let i = 1; i <= chaptersNumber; i++) {
            const chapterUrl = `${url}/chapter-${i}`;
            const chapter = {
                href: chapterUrl,
                number: i,
                title: `Chapter ${i}`
            };

            chapters.push(chapter);
        }

        console.log(JSON.stringify(chapters));
        return chapters;
    } catch (error) {
        console.log('Fetch error in extractChapters:', error);
        return JSON.stringify([]);
    }
}

async function extractText(url) {
    try {
        const response = await soraFetch(url);
        const htmlText = await response.text();

        const contentMatch = htmlText.match(/<div id="content"[^>]*>([\s\S]*?)<\/div>/);
        if (!contentMatch) {
            throw new Error("Content block not found");
        }

        let content = contentMatch[1];

        content = content.replace(/<p class="box-notification fs-17">[\s\S]*?<\/p>\s*/g, '');

        content = content.trim();
        content = `
            <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        `.trim();

        console.log(JSON.stringify(content));
        return content;
    } catch (error) {
        console.log("Fetch error in extractText:", error);
        return JSON.stringify({ text: 'Error extracting text' });
    }
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
