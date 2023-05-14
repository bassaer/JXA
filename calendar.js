#!/usr/bin/osascript -l JavaScript

const CALENDAR_NAME = '開発';
const BUTTON_OK = "OK";
const BUTTON_CANCEL = "Cancel";

function openUrl(url) {
  const chrome = Application("Google Chrome");
  const win = chrome.windows[0];
  const tab = new chrome.Tab()
  win.tabs.push(tab) - 1
  tab.url = url
}

function formatDate (date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format;
};

function createDialog(title, url, start, end) {
  try {
   	const result = app.displayDialog(`${title} に参加しますか？`, {
      withTitle: `${formatDate(start, 'HH:mm')} 〜 ${formatDate(end, 'HH:mm')}`,
      buttons: [BUTTON_OK, BUTTON_CANCEL],
      defaultButton: BUTTON_OK,
      cancelButton: BUTTON_CANCEL
    })
    if (result && result.buttonReturned === BUTTON_OK) {
      openUrl(url);
    }
  } catch(e) {}
}

const app = Application.currentApplication(); // 現在のアプリケーションオブジェクトを取得する
app.includeStandardAdditions = true; // 標準コマンドを使用可能にする
const calendar = Application("Calendar");

const events = calendar.calendars[CALENDAR_NAME].events;
const now = Date.now();
for (event in events) {
	if (
    events[event].startDate() < now
    && events[event].endDate() > now
    && events[event].location().startsWith("https://")
  ) {
    createDialog(
      events[event].summary(),
      events[event].location(),
      events[event].startDate(),
      events[event].endDate()
    );
  }
}
