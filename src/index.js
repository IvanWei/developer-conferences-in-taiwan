import Calendar from 'tui-calendar';
import './tui-calendar.css';
import './style.css';

import {data as confs} from '../data/conference-data.json';

let CalendarList = [];
let taskId = 0;
let calendarId = 0;

const calendar = new Calendar('#calendar', {
  defaultView: 'month',
  taskView: false,
  // isReadOnly: true,
});

confs.forEach((conf, index) => {
  if (!(conf['table'] && conf['table'].rows)) return;

  const rowData = conf['table'].rows;
  rowData.forEach((row) => {
    taskId++;
    calendarId++;

    CalendarList.push({
      id: taskId,
      calendarId,
      title: row.Name.link.title || row.Name,
      category: 'time',
      start: new Date('2018.' + row['Start date']).toUTCString(),
      end: new Date('2018.' + (row['End date'] === '---'?row['Start date']:row['End date'])).toUTCString(),
      location: row['Venue'],
    });
  });

});

calendar.createSchedules(CalendarList);

$('div.btn-change-view').on('click', (e) => {
  var switchView = (e.target.dataset.changeView || e.target.innerHTML).toLowerCase();
  if (switchView === 'today') {
    let currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    calendar.today();
    $('#current-date').text(`${year}-${month}`);

    return;
  }
  calendar.changeView(switchView, true);
});

$('#previous-view').on('click', (e) => {
  let currentDate = new Date($('#current-date').text());
  currentDate.setMonth(currentDate.getMonth() - 1);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  calendar.prev();
  $('#current-date').text(`${year}-${month}`);
});

$('#next-view').on('click', (e) => {
  let currentDate = new Date($('#current-date').text());
  currentDate.setMonth(currentDate.getMonth() + 1);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  calendar.next();
  $('#current-date').text(`${year}-${month}`);
});

calendar.on('clickSchedule', function(event) {
  const schedule = event.schedule;
  const startDate = new Date(schedule.start);
  const endDate = new Date(schedule.end);

  let content = document.createElement("div");
  let date = document.createElement("div");
  let venue = document.createElement("div");
  let remark = document.createElement("a");

  date.innerText = '日期：';
  date.innerText += `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`;
  date.innerText += ` ~ ${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`;
  venue.innerText = `地點：${schedule.location}`;
  remark.innerText = '詳細可至 Github Link 取得';
  remark.href = 'https://github.com/IvanWei/developer-conferences-in-taiwan/#readme';
  remark.target = "_blank";

  content.appendChild(date);
  content.appendChild(venue);
  content.appendChild(document.createElement("hr"));
  content.appendChild(remark);

  swal({
    title: schedule.title,
    content,
  });
});
