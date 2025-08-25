import { writeFile } from 'node:fs/promises';
import showdown from 'showdown';

const [type] = process.argv.slice(2);

import json2md from 'json2md';
import conferenceData from './data/conference-data.json' with { type: 'json' };
import organizationData from './data/list-of-organization.json' with {
  type: 'json',
};

showdown.extension('targetlink', () => [
  {
    type: 'lang',
    regex:
      /\[((?:\[[^\]]*]|[^[\]])*)]\([ \t]*<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\4[ \t]*)?\)/g,
    replace: (_wholematch, linkText, url) => {
      const result = `<a href="${url}" target="_blank" alt="${linkText}">${linkText}</a>`;

      return result;
    },
  },
  {
    type: 'output',
    filter: (html) => {
      const regex = /<table>/g;
      return html.replace(
        regex,
        '<table class="pure-table pure-table-bordered" style="width: 100%;">',
      );
    },
  },
]);

switch (type) {
  case 'readme': {
    const NOTES = [
      { hr: '' },
      { h2: 'NOTE' },
      { p: '資訊由網路上收集而來，所有活動資訊以活動主辦單位公佈為準。' },
      {
        ul: [
          {
            link: {
              title: 'Architecture',
              source:
                'https://github.com/IvanWei/developer-conferences-in-taiwan/wiki',
            },
          },
          {
            link: {
              title: 'DCIT calendar (Web version)',
              source: 'https://dcit.ivanwei.co/',
            },
          },
        ],
      },
      { hr: '' },
    ];

    conferenceData.data[0].h1 = `${conferenceData.data[0].h1} / Leader Conferences in Taiwan ${new Date().getFullYear()}`;
    const reamdeMeData = [
      ...conferenceData.data,
      [{ hr: '' }],
      ...organizationData.data,
    ];

    reamdeMeData.splice(1, ...NOTES);

    writeFile(
      'README.md',
      json2md(reamdeMeData).replace(/(\n\d{1,2}|\)\n\n)/g, (substr) => {
        const month = substr.match(/\d{1,2}/);
        if (month) {
          return `| ${month}`;
        } else {
          return `)\n |`;
        }
      }),
    ).then((err) => {
      if (err) {
        /* biome-ignore lint/suspicious/noConsole: ingore */
        console.log('README.md, Failed');
        return;
      }
      /* biome-ignore lint/suspicious/noConsole: ingore */
      console.log('README.md, OK');
    });

    break;
  }
  case 'ghPage': {
    const titleOfHtml = 'Developer Conferences in Taiwan';
    const descriptionOfHtml = '統整研討會資訊';
    const coverImgOfHtml = 'https://blog.ivanwei.co/images/2018/05/16/DCIT.png';
    const converter = new showdown.Converter({
      tables: true,
      extensions: ['targetlink'],
    });

    function fixJson2Md(content) {
      return content
        .replace(/\n /g, ' ')
        .replace(/(\n\d{1,2}|\)\n\n)/g, (substr) => {
          const month = substr.match(/\d{1,2}/);
          if (month) {
            return `| ${month}`;
          } else {
            return `)\n |`;
          }
        });
    }

    const conferenceHtml = (content) =>
      `
      <!DOCTYPE HTML>
      <html lang="zh-tw">
      <head>
        <meta charset="utf-8">
        <title>${titleOfHtml}</title>
        <link rel="icon" type="image/svg+xml" href="https://dcit-calendar.ivanwei.co/favicon.svg">
        <link rel="alternate icon" href="https://dcit-calendar.ivanwei.co/favicon.ico">
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
          #organization:checked ~ .organization {
            display: block;
          }
          .btn {
            text-decoration: none;

            height: 22px;
            line-height: 22px;
            display: inline-block;
            cursor: pointer;
            padding: 5px;
            text-align: center;
            color: white;
            border-radius: 4px;
            text-shadow: 0 1px 1px rgb(0 0 0 / 20%);
          }
          .btn:not(:last-of-type) {
            margin-right: 10px;
          }
        </style>
      </head>
      <body>
        <nav>
          <a class='btn' style='background: rgb(28, 184, 65);' href='/' rel='ugc'>查詢今年活動 (總表)</a>
          <a class='btn' style='background: #8058a5;' href='https://dcit-calendar.ivanwei.co' rel='ugc'>查詢今年活動 (行事曆版)</a>
          <a class='btn' style='background: rgb(66, 184, 221);' href='/organization' rel='ugc'>查看活動籌備單位</a>
          <a class='btn' style='background: rgb(223, 117, 20);' href='https://github.com/IvanWei/developer-conferences-in-taiwan/blob/master/data/list-of-organizations.json' target='_blank' rel='ugc nofollow'>新增活動籌備單位</a>
        </nav>

        <div class="conference">
          ${content}
        </div>
      </body>
      </html>
    `.replace(/(\r\n|\n|\r| {2})/gm, '');

    writeFile(
      'docs/index.html',
      conferenceHtml(converter.makeHtml(fixJson2Md(json2md(conferenceData)))),
      (err) => {
        if (err) throw err;
        /* biome-ignore lint/suspicious/noConsole: ingore */
        console.log('index.html, OK');
      },
    );
    writeFile(
      'docs/organization.html',
      conferenceHtml(converter.makeHtml(fixJson2Md(json2md(organizationData)))),
      (err) => {
        if (err) throw err;
        /* biome-ignore lint/suspicious/noConsole: ingore */
        console.log('organization.html, OK');
      },
    );

    break;
  }
}
