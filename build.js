const fs = require('fs');
const showdown  = require('showdown');

const [type] = process.argv.slice(2);

const json2md = require('json2md');
const conferenceData = require("./data/conference-data.json").data;
const organizationData = require("./data/list-of-organizations.json").data;

showdown.extension('targetlink', function() {
  return [{
    type: 'lang',
    regex: /\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\4[ \t]*)?\)/g,
    replace: function(wholematch, linkText, url) {
      const result = `<a href="${url}" target="_blank" alt="${linkText}">${linkText}</a>`;

      return result;
    }
  }];
});

switch (type) {
  case 'readme':
    const reamdeMeData = Array.prototype.concat.call(conferenceData, [{"hr": ""}], organizationData);

    fs.writeFile('README.md', json2md(reamdeMeData), (err) => {
      if (err) throw err;
      console.log('README.md, OK');
    });

    break;
  case 'ghPage':
    const converter = new showdown.Converter({tables: true, extensions: ['targetlink']});

    const conferenceHtml = (`
      <!DOCTYPE HTML>
      <html lang="zh-tw">
      <head>
        <meta charset="utf-8">
        <title>Developer Conferences in Taiwan</title>
        <meta name="description" content="統整研討會資訊" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Developer Conferences in Taiwan" />
        <meta property="og:description" content="統整研討會資訊" />
        <meta property="og:url" content="https://dcit.ivanwei.co" />
        <meta property="og:site_name" content="Developer Conferences in Taiwan" />
        <meta property="og:image" content="https://blog.ivanwei.co/images/2018/05/16/DCIT.png" />
        <meta property="og:locale" content="zh_TW" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Developer Conferences in Taiwan" />
        <meta name="twitter:description" content="統整研討會資訊" />
        <meta name="twitter:image" content="https://blog.ivanwei.co/images/2018/05/16/DCIT.png" />

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/picnic">
      </head>
      <body>
        <a class="button" href="/organization.html">查看活動籌備單位</a>
        <a class="button" href="https://github.com/IvanWei/developer-conferences-in-taiwan/blob/master/data/list-of-organizations.json">新增活動籌備單位</a>
        ${converter.makeHtml(json2md(conferenceData))}
      </body>
      </html>
    `).replace(/(\r\n|\n|\r|\ \ )/gm, '');

    fs.writeFile('docs/index.html', conferenceHtml, (err) => {
      if (err) throw err;
      console.log('gh-page, OK');
    });

    const organizationHtml = (`
      <!DOCTYPE HTML>
      <html lang="zh-tw">
      <head>
        <meta charset="utf-8">
        <title>Developer Conferences in Taiwan</title>
        <meta name="description" content="統整研討會資訊" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Developer Conferences in Taiwan" />
        <meta property="og:description" content="統整研討會資訊" />
        <meta property="og:url" content="https://dcit.ivanwei.co" />
        <meta property="og:site_name" content="Developer Conferences in Taiwan" />
        <meta property="og:image" content="https://blog.ivanwei.co/images/2018/05/16/DCIT.png" />
        <meta property="og:locale" content="zh_TW" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Developer Conferences in Taiwan" />
        <meta name="twitter:description" content="統整研討會資訊" />
        <meta name="twitter:image" content="https://blog.ivanwei.co/images/2018/05/16/DCIT.png" />

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/picnic">
      </head>
      <body>
        <a class="button" href="/index.html">查詢今年活動</a>
        <a class="button" href="https://github.com/IvanWei/developer-conferences-in-taiwan/blob/master/data/list-of-organizations.json">新增活動籌備單位</a>
        ${converter.makeHtml(json2md(organizationData))}
      </body>
      </html>
    `).replace(/(\r\n|\n|\r|\ \ )/gm, '');

    fs.writeFile('docs/organization.html', organizationHtml, (err) => {
      if (err) throw err;
      console.log('gh-page, OK');
    });

    break;
}
