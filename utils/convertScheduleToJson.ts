const { readFileSync, writeFile } = require('fs');

const data: string[] = readFileSync('recaps/schedule.txt', 'utf-8').replace(/\r/g, '').split('\n');

const schedule = [{
  week: 0,
  pairings: []
}];
let weekData: any = {};

let week = 0;
while (week < data.length) {
  weekData = {
    week: week + 1,
    pairings: []
  };

  if (data[week] !== 'POS') {
    const weekPairings = data[week].split(' ');

    let team = 0;
    while (team < weekPairings.length) {
      weekData.pairings.push({
        away: +weekPairings[team],
        home: +weekPairings[team + 1]
      });

      team += 2;
    }
  }

  schedule.push(weekData);

  week += 1;
}

const jsonData = JSON.stringify(schedule, null, 2);

writeFile('recaps/schedule.json', jsonData, (err: any) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log(`JSON file has been saved`);
  }
});
