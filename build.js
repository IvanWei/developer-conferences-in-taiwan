const fs = require('fs');
const showdown  = require('showdown');

const [type] = process.argv.slice(2);

const json2md = require('json2md');
const conferenceData = require("./data/conference-data.json").data;
const organizationData = require("./data/list-of-organizations.json").data;

const data = Array.prototype.concat.call(conferenceData, [{"hr": ""}], organizationData);

switch (type) {
  case 'readme':
    fs.writeFile('README.md', json2md(data), (err) => {
      if (err) throw err;
      console.log('README.md, OK');
    });

    break;
  case 'ghPage':
    const converter = new showdown.Converter({tables: true});
    const html = (`
      <!DOCTYPE HTML><html>
      <head>
        <meta charset="utf-8">
        <title>Developer Conferences in Taiwan</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/picnic">
      </head>
      <body>
        ${converter.makeHtml(json2md(data))}
      </body>
      </html>
    `).replace(/(\r\n|\n|\r|\ \ )/gm, '');

    fs.writeFile('dist/index.html', html, (err) => {
      if (err) throw err;
      console.log('gh-page, OK');
    });

    break;
}
