const fs = require('fs');
const showdown  = require('showdown');

const [type] = process.argv.slice(2);

const json2md = require('json2md');
const conferenceData = require("./data/conference-data.json").data;
const organizationData = require("./data/list-of-organizations.json").data;

const data = Array.prototype.concat.call(conferenceData, [{"hr": ""}], organizationData);

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
    fs.writeFile('README.md', json2md(data), (err) => {
      if (err) throw err;
      console.log('README.md, OK');
    });

    break;
  case 'ghPage':
    const converter = new showdown.Converter({tables: true, extensions: ['targetlink']});
    const html = (`
      <!DOCTYPE HTML>
      <html lang="zh-hant">
      <head>
        <meta charset="utf-8">
        <title>Developer Conferences in Taiwan</title>
        <meta name="description" content="統整開發相關研討會資訊" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="article" />
        <meta property="og:title" content="Developer Conferences in Taiwan" />
        <meta property="og:description" content="統整開發相關研討會資訊" />
        <meta property="og:url" content="https://dcit.ivanwei.co" />
        <meta property="og:site_name" content="Developer Conferences in Taiwan" />
        <meta property="og:image" content="https://blog.ivanwei.co/images/2018/05/16/DCIT.png" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Developer Conferences in Taiwan" />
        <meta name="twitter:description" content="統整開發相關研討會資訊" />
        <meta name="twitter:image" content="https://blog.ivanwei.co/images/2018/05/16/DCIT.png" />

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/picnic">
      </head>
      <body>
        ${converter.makeHtml(json2md(data))}
      </body>
      </html>
    `).replace(/(\r\n|\n|\r|\ \ )/gm, '');

    fs.writeFile('docs/index.html', html, (err) => {
      if (err) throw err;
      console.log('gh-page, OK');
    });

    break;
}
