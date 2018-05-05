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
  isReadOnly: true,
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
      title: row.Name.link.title,
      category: 'time',
      start: new Date('2018.' + row['Start date']).toUTCString(),
      end: new Date('2018.' + (row['End date'] === '---'?row['Start date']:row['End date'])).toUTCString(),
    });
  });

});

calendar.createSchedules(CalendarList);

$('div.btn-change-view').on('click', (e) => {
  var switchView = (e.target.dataset.changeView || e.target.innerHTML).toLowerCase();
  if (switchView === 'today') {
    calendar.today();
    return;
  }
  calendar.changeView(switchView, true);
});

$('#previous-view').on('click', (e) => {
  const currentDate = new Date($('#current-date').text());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  calendar.prev();
  $('#current-date').text(`${year}-${month-1}`);
});

$('#next-view').on('click', (e) => {
  const currentDate = new Date($('#current-date').text());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  calendar.next();
  $('#current-date').text(`${year}-${month+1}`);
});
