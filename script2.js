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
