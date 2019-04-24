import Calendar from '@ivanwei/tui-calendar';
import './tui-calendar.css';
import './style.css';

import {data as confs} from '../data/conference-data.json';

let CalendarList = [];
let taskId = 0;
let calendarId = 0;

const calendar = new Calendar('#calendar', {
  defaultView: 'month',
  taskView: false,
  isReadOnly: true,
});

confs.forEach((conf, index) => {
  if (!(conf['table'] && conf['table'].rows)) return;

  const rowData = conf['table'].rows;
  rowData.forEach((row) => {
    taskId++;
    calendarId++;

    if (row['Start date']) {
      CalendarList.push({
        id: taskId,
        calendarId,
        title: row.Name.link && row.Name.link.title || row.Name,
        category: 'time',
        start: new Date(row['Year'] + '.' + row['Start date']).toUTCString(),
        end: new Date(row['Year'] + '.' + (row['End date'] === '---'?row['Start date']:row['End date'])).toUTCString(),
        location: row['Venue'],
        raw: row.Ticket.link && row.Ticket.link.source || row.Ticket,
      });
    }
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
  let gCalendarLink = document.createElement("a");
  let remark = document.createElement("a");

  date.innerText = '日期：';
  date.innerText += `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`;
  date.innerText += ` ~ ${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`;
  venue.innerText = `地點：${schedule.location}`;
  gCalendarLink.innerText = '1. 將活動加進 Google calendar';
  gCalendarLink.href = 'https://www.google.com/calendar/render?action=TEMPLATE';
  gCalendarLink.href += `&text=${schedule.title}&details=活動地點：${schedule.location}/售票：${schedule.raw}`;
  gCalendarLink.href += `&location=${schedule.location}&dates=`;
  gCalendarLink.href += `${startDate.toJSON().replace(/(-|:|\.[0-9]{3})/g, '')}/${endDate.toJSON().replace(/(-|:|\.[0-9]{3})/g, '')}`;
  gCalendarLink.target = "_blank";
  remark.innerText = '2. 了解更多可至 Github repo 取得';
  remark.href = 'https://github.com/IvanWei/developer-conferences-in-taiwan/#readme';
  remark.target = "_blank";

  // https://www.google.com/calendar/render?action=TEMPLATE&text=iThome+Cloud+Summit+2018&details=%E5%8F%B0%E5%8C%97%E5%9C%8B%E9%9A%9B%E6%9C%83%E8%AD%B0%E4%B8%AD%E5%BF%83+%28TICC%29%2F%E6%99%82%E9%96%93%EF%BC%9Ahttp%3A%2F%2Ftw.yahoo.com&location=%E5%8F%B0%E5%8C%97%E5%9C%8B%E9%9A%9B%E6%9C%83%E8%AD%B0%E4%B8%AD%E5%BF%83+%28TICC%29&dates=20180515T140200Z%2F20180517T140300Z

  // https://calendar.google.com/calendar/r/eventedit?text=iThome+Cloud+Summit+2018&details=%E6%B4%BB%E5%8B%95%E5%9C%B0%E9%BB%9E%EF%BC%9A%E5%8F%B0%E5%8C%97%E5%9C%8B%E9%9A%9B%E6%9C%83%E8%AD%B0%E4%B8%AD%E5%BF%83+(TICC)/%E5%94%AE%E7%A5%A8%EF%BC%9A%5Bobject+Object%5Dlocation%3D%E5%8F%B0%E5%8C%97%E5%9C%8B%E9%9A%9B%E6%9C%83%E8%AD%B0%E4%B8%AD%E5%BF%83+(TICC)&dates=201805-15T16:00:00.000Z/201805-15T16:00:00.000Z
  // // https://www.google.com/calendar/render?action=TEMPLATE&text=test&details=aaa&location=tet&dates=20180515T140200Z%2F20180517T140300Z

  content.appendChild(date);
  content.appendChild(venue);
  content.appendChild(document.createElement("hr"));
  content.appendChild(gCalendarLink);
  content.appendChild(document.createElement("br"));
  content.appendChild(remark);

  swal({
    title: schedule.title,
    content,
  });
});
