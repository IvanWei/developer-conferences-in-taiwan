const fs = require('fs');
const showdown  = require('showdown');

const [type] = process.argv.slice(2);

const json2md = require('json2md');
const conferenceData = require("./data/conference-data.json").data;
const organizationData = require("./data/list-of-organizations.json").data;

showdown.extension('targetlink', function() {
  return [
    {
      type: 'lang',
      regex: /\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\4[ \t]*)?\)/g,
      replace: function(wholematch, linkText, url) {
        const result = `<a href="${url}" target="_blank" alt="${linkText}">${linkText}</a>`;

        return result;
      },
    }, {
      type: 'output',
      filter: (html) => {
        const regex = /<table>/g;
        return html.replace(regex, '<table class="pure-table pure-table-bordered" style="width: 100%;">');
      },
    },
  ];
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
    const titleOfHtml = 'Developer Conferences in Taiwan';
    const descriptionOfHtml = '統整研討會資訊';
    const coverImgOfHtml = 'https://blog.ivanwei.co/images/2018/05/16/DCIT.png';
    const converter = new showdown.Converter({tables: true, extensions: ['targetlink']});

    const conferenceHtml = (`
      <!DOCTYPE HTML>
      <html lang="zh-tw">
      <head>
        <meta charset="utf-8">
        <title>${titleOfHtml}</title>
        <meta name="description" content="${descriptionOfHtml}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="${titleOfHtml}" />
        <meta property="og:description" content="${descriptionOfHtml}" />
        <meta property="og:url" content="https://dcit.ivanwei.co" />
        <meta property="og:site_name" content="${titleOfHtml}" />
        <meta property="og:image" content="${coverImgOfHtml}" />
        <meta property="og:locale" content="zh_TW" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="${titleOfHtml}" />
        <meta name="twitter:description" content="${descriptionOfHtml}" />
        <meta name="twitter:image" content="${coverImgOfHtml}" />

        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css" crossorigin="anonymous">
        <style>
          body {
            margin: 5px;
          }
          input[name="tabset"] {
            display: none;
          }
          #conference, #organization {
            cursor: pointer;
          }
          .conference, .organization {
            display: none;
          }
          #conference:checked ~ .conference {
            display: block;
          }
          #organization:checked ~ .organization {
            display: block;
          }
          .btn {
            width: 130px;
            display: inline-block;
            cursor: pointer;
            padding: 5px;
            text-align: center;
            color: white;
            border-radius: 4px;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          }
          .btn:last-of-type {
            margin-left: 5px;
          }
        </style>
      </head>
      <body>
        <label for="conference" class="btn" style="background: rgb(28, 184, 65);">查詢今年活動</label>
        <input type="radio" name="tabset" id="conference" aria-controls="conference" checked>
        <label for="organization" class="btn" style="background: rgb(66, 184, 221);">查看活動籌備單位</label>
        <input type="radio" name="tabset" id="organization" aria-controls="organization">
        <a class="btn" style="background: rgb(223, 117, 20);text-decoration: none;" target="_blank" href="https://github.com/IvanWei/developer-conferences-in-taiwan/blob/master/data/list-of-organizations.json">新增活動籌備單位</a>

        <!--<div class="pure-menu custom-restricted-width">
          <ul class="pure-menu-list">
            <li class="pure-menu-item pure-menu-has-children">
              <a href="#" id="menuLink1" class="pure-menu-link">More</a>
              <ul class="pure-menu-children">
                <li class="pure-menu-item">
                  <a class="pure-menu-link" href="/index.html">查詢今年活動</a>
                </li>
                <li class="pure-menu-item">
                  <a class="pure-menu-link" href="/organization.html">查看活動籌備單位</a>
                </li>
                <li class="pure-menu-item">

                </li>
              </ul>
            </li>
          </ul>
        </div>--!>

        <div class="conference">
          ${converter.makeHtml(json2md(conferenceData))}
        </div>
        <div class="organization">
          ${converter.makeHtml(json2md(organizationData))}
        </div>
      </body>
      </html>
    `).replace(/(\r\n|\n|\r|\ \ )/gm, '');

    fs.writeFile('docs/index.html', conferenceHtml, (err) => {
      if (err) throw err;
      console.log('index.html, OK');
    });

    break;
}
