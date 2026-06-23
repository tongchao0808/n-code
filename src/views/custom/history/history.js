import dayjs from "dayjs";


function todayHistories(dataList) {
  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');
  return filterHistoriesByDateRange(dataList, today, tomorrow);
}
function yesterdayHistories(dataList) {
  const yesterday = dayjs().subtract(1, 'day').startOf('day');
  const today = dayjs().startOf('day');
  return filterHistoriesByDateRange(dataList, yesterday, today);
}
function lastWeekHistories(dataList) {
  const weekStart = dayjs().subtract(7, 'day').startOf('day');
  const twoDaysAgo = dayjs().subtract(2, 'day').startOf('day');
  return filterHistoriesByDateRange(dataList, weekStart, twoDaysAgo);
}
function earlierHistories(dataList) {
  const weekStart = dayjs().subtract(7, 'day').startOf('day');
  return filterHistoriesByDateRange(dataList, null, weekStart);
}


export function getGroupedHistories(dataList) {
  return [
    {title: '', records: todayHistories(dataList)},
    {title: '昨天', records: yesterdayHistories(dataList)},
    {title: '上周', records: lastWeekHistories(dataList)},
    {title: '更早', records: earlierHistories(dataList)},
  ]
}

function filterHistoriesByDateRange(dataList, startDate, endDate) {
  return dataList
    .filter(item => {
      const itemDate = dayjs(item.dateTime);
      const afterStart = startDate ? itemDate.isAfter(startDate) : true;
      const beforeEnd = endDate ? itemDate.isBefore(endDate) : true;
      return afterStart && beforeEnd;
    })
    .sort((a, b) => dayjs(b.dateTime).valueOf() - dayjs(a.dateTime).valueOf());
}
