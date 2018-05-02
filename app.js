const fs = require('fs');

const json2md = require('json2md');
const conferenceData = require("./data/conference-data.json").data;
const organizationData = require("./data/list-of-organizations.json").data;

const data = Array.prototype.concat.call(conferenceData, [{"hr": ""}], organizationData);

fs.writeFile('README.md', json2md(data), (err) => {
  if (err) throw err;
  console.log('OK')
});
