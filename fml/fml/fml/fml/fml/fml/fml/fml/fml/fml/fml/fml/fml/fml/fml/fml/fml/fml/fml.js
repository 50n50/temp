async function searchResults(_0x4a2b8f){const _0x3f7d1e=(_0x5c8a4b)=>encodeURIComponent(_0x5c8a4b);const _0x2b9e5a='https://animekai.to/browser?keyword=';const _0x1d4f3c='https://animekai.to';const _0x6e8d2f=/href="[^"]*" class="poster"/g;const _0x9c4a1b=/class="title"[^>]*title="[^"]*"/g;const _0x7f3e4c=/data-src="[^"]*"/g;const _0x4b8e9d=/href="([^"]*)"/;const _0x8a5c3f=/data-src="([^"]*)"/;const _0x2e7f6a=/title="([^"]*)"/;try{const _0x5e4d7c=_0x3f7d1e(_0x4a2b8f);const _0x8f2a5b=_0x2b9e5a+_0x5e4d7c;const _0x3c9e8d=await fetchv2(_0x8f2a5b);const _0x7b4f2e=await _0x3c9e8d.text();const _0x6d5a3c=[];const _0x9e3f7a=_0x7b4f2e.match(_0x6e8d2f)||[];const _0x4c8b9e=_0x7b4f2e.match(_0x9c4a1b)||[];const _0x2f6e5d=_0x7b4f2e.match(_0x7f3e4c)||[];const _0x5a8d3f=Math.min(_0x9e3f7a.length,_0x4c8b9e.length,_0x2f6e5d.length);for(let _0x7c2e4b=0x0;_0x7c2e4b<_0x5a8d3f;_0x7c2e4b++){const _0x8e3f9a=_0x9e3f7a[_0x7c2e4b].match(_0x4b8e9d);const _0x6f4d2c=_0x8e3f9a?(_0x8e3f9a[0x1].startsWith('http')?_0x8e3f9a[0x1]:_0x1d4f3c+_0x8e3f9a[0x1]):null;const _0x9a5e7b=_0x2f6e5d[_0x7c2e4b].match(_0x8a5c3f);const _0x3d8f4e=_0x9a5e7b?_0x9a5e7b[0x1]:null;const _0x7e6a2f=_0x4c8b9e[_0x7c2e4b].match(_0x2e7f6a);const _0x4f9c3b=_0x7e6a2f?((_0x5b8d4e)=>{return!_0x5b8d4e?'':_0x5b8d4e.replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ')})(_0x7e6a2f[0x1]):null;if(_0x6f4d2c&&_0x3d8f4e&&_0x4f9c3b){_0x6d5a3c.push({'href':_0x6f4d2c,'image':_0x3d8f4e,'title':_0x4f9c3b});}}return JSON.stringify(_0x6d5a3c);}catch(_0x8c4e7d){return JSON.stringify([{'href':'','image':'','title':'Search failed: '+_0x8c4e7d.message}]);}} async function extractDetails(_0x1a2c9f){try{const _0x3f5c1b=await fetchv2(_0x1a2c9f);const _0x2a8b14=await _0x3f5c1b.text();console.log(_0x2a8b14);const _0x41dd38=(/<div class="desc text-expand">([\s\S]*?)<\/div>/.exec(_0x2a8b14)||[])[1];const _0x2de94c=(/<small class="al-title text-expand">([\s\S]*?)<\/small>/.exec(_0x2a8b14)||[])[1];return JSON.stringify([{'description':_0x41dd38?cleanHtmlSymbols(_0x41dd38):'Not available','aliases':_0x2de94c?cleanHtmlSymbols(_0x2de94c):'Not available','airdate':'Not available'}]);}catch(_0x41e518){console.error('Error fetching details:'+_0x41e518);return [{'description':'Error loading description','aliases':'Aliases: Unknown','airdate':'Aired: Unknown'}];}} async function extractEpisodes(_0x2b1f4e){try{const _0x5a8f3b=await fetchv2(_0x2b1f4e);const _0x1c9e27=await _0x5a8f3b.text();const _0x3f8a6d=(_0x1c9e27.match(/<div class="rate-box"[^>]*data-id="([^"]+)"/)||[])[1];if(!_0x3f8a6d)return[{error:'AniID not found'}];const _0x4d2f1c=await fetchv2(`https://passthrough-worker.simplepostrequest.workers.dev/?url=https://c-kai-8090.amarullz.com/?f=e&body=${encodeURIComponent(_0x3f8a6d)}&type=text`);const _0x5e7c9b=await _0x4d2f1c.text();const _0x7f1d3a=`https://animekai.to/ajax/episodes/list?ani_id=${_0x3f8a6d}&_=${_0x5e7c9b}`;console.log('List API URL:'+_0x7f1d3a);const _0x6b3d8e=await fetchv2(_0x7f1d3a);const _0x9a2e4f=await _0x6b3d8e.json();const _0x1b4f7d=cleanJsonHtml(_0x9a2e4f.result);const _0x8c7a2b=/<a[^>]+num="([^"]+)"[^>]+token="([^"]+)"[^>]*>/g;const _0x4f6b3d=[..._0x1b4f7d.matchAll(_0x8c7a2b)].slice(0,400);const _0x3d2f5a=_0x4f6b3d.map(([_,num,token])=>fetchv2(`https://passthrough-worker.simplepostrequest.workers.dev/?url=https://c-kai-8090.amarullz.com/?f=e&body=${encodeURIComponent(token)}&type=text`).then(r=>r.text()).then(t=>({number:parseInt(num,10),href:`https://animekai.to/ajax/links/list?token=${token}&_=${t}`})).catch(()=>({number:parseInt(num,10),href:'Error'})));const _0x6f4b2c=await Promise.all(_0x3d2f5a);return JSON.stringify(_0x6f4b2c);}catch(err){console.error('Error fetching episodes:'+err);return[{number:1,href:'Error fetching episodes'}];}}

async function extractStreamUrl(url) {
    try {
        const fetchUrl = `${url}`;
        const response = await fetchv2(fetchUrl);
        const text = await response.text();
        const cleanedHtml = cleanJsonHtml(text);

        const subRegex = /<div class="server-items lang-group" data-id="sub"[^>]*>([\s\S]*?)<\/div>/;
        const softsubRegex = /<div class="server-items lang-group" data-id="softsub"[^>]*>([\s\S]*?)<\/div>/;
        const dubRegex = /<div class="server-items lang-group" data-id="dub"[^>]*>([\s\S]*?)<\/div>/;

        const subMatch = subRegex.exec(cleanedHtml);
        const softsubMatch = softsubRegex.exec(cleanedHtml);
        const dubMatch = dubRegex.exec(cleanedHtml);

        const sub = subMatch ? subMatch[1].trim() : "";
        const softsub = softsubMatch ? softsubMatch[1].trim() : "";
        const dub = dubMatch ? dubMatch[1].trim() : "";

        const serverSpanRegex = /<span class="server"[^>]*data-lid="([^"]+)"[^>]*>Server 1<\/span>/;
        const serverMatchDub = serverSpanRegex.exec(dub)?.[1];
        const serverMatchSoftsub = serverSpanRegex.exec(softsub)?.[1];
        const serverMatchSub = serverSpanRegex.exec(sub)?.[1];

        const [streamResDub, streamResSoftsub, streamResSub] = await Promise.all([
            fetchv2(`https://passthrough-worker.simplepostrequest.workers.dev/?url=https://c-kai-8090.amarullz.com/?f=e&body=${serverMatchDub}&type=text`).then(res => res.text()),
            fetchv2(`https://passthrough-worker.simplepostrequest.workers.dev/?url=https://c-kai-8090.amarullz.com/?f=e&body=${serverMatchSoftsub}&type=text`).then(res => res.text()),
            fetchv2(`https://passthrough-worker.simplepostrequest.workers.dev/?url=https://c-kai-8090.amarullz.com/?f=e&body=${serverMatchSub}&type=text`).then(res => res.text())
        ]);

        const streamUrlDub = `https://animekai.to/ajax/links/view?id=${serverMatchDub}&_=${streamResDub}`;
        const streamUrlSoftsub = `https://animekai.to/ajax/links/view?id=${serverMatchSoftsub}&_=${streamResSoftsub}`;
        const streamUrlSub = `https://animekai.to/ajax/links/view?id=${serverMatchSub}&_=${streamResSub}`;

        const [decryptedDub, decryptedSoftsub, decryptedSub] = await Promise.all([
            fetchv2(streamUrlDub)
                .then(res => res.json())
                .then(json => json.result)
                .then(result => fetchv2(`https://passthrough-worker.simplepostrequest.workers.dev/?url=https://c-kai-8090.amarullz.com/?f=d&body=${result}&type=text`).then(res => res.text()))
                .then(text => {
                    const parsed = JSON.parse(text);
                    console.log('decryptedDub URL:'+ parsed.url);
                    return parsed.url;
                }),
            fetchv2(streamUrlSoftsub)
                .then(res => res.json())
                .then(json => json.result)
                .then(result => fetchv2(`https://passthrough-worker.simplepostrequest.workers.dev/?url=https://c-kai-8090.amarullz.com/?f=d&body=${result}&type=text`).then(res => res.text()))
                .then(text => {
                    const parsed = JSON.parse(text);
                    console.log('decryptedSoftsub URL:'+ parsed.url);
                    return parsed.url;
                }),
            fetchv2(streamUrlSub)
                .then(res => res.json())
                .then(json => json.result)
                .then(result => fetchv2(`https://passthrough-worker.simplepostrequest.workers.dev/?url=https://c-kai-8090.amarullz.com/?f=d&body=${result}&type=text`).then(res => res.text()))
                .then(text => {
                    const parsed = JSON.parse(text);
                    console.log('decryptedSub URL:'+ parsed.url);
                    return parsed.url;
                })
        ]);
        console.log(decryptedSub);
        const networkResult = await networkFetch(decryptedSub + "?autostart=true", timeout = 5); 
        console.log('Network fetch result:', networkResult);

        if (networkResult.m3u8Links && networkResult.m3u8Links.length > 0) {
            const streamUrl = networkResult.m3u8Links[0];
            console.log('Found stream URL:', streamUrl);
            return streamUrl;
        } else {
            console.log('No m3u8 links found');
            return null; 
        }
    } catch (error) {
        console.log('Fetch error:', error);
        return "https://error.org";
    }
}


function cleanHtmlSymbols(string) {
  if (!string) return "";
  return string
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&#[0-9]+;/g, "")
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanJsonHtml(jsonHtml) {
  if (!jsonHtml) return "";
  return jsonHtml
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r');
}
