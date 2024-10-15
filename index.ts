import { getMahonyStandings } from './utils/mahony';
import { getPetersonStandings } from './utils/peterson';
import { getTraditionalStandings } from './utils/traditional';

const { readFileSync } = require('fs');

let weekNumber = 1;
while (weekNumber > 0) {
  try {
    const weekRecap = JSON.parse(readFileSync(`recaps/week${weekNumber}.json`, 'utf-8'));

    // 35 point system
    getPetersonStandings(weekNumber, weekRecap);

    // 7 point system
    getTraditionalStandings();

    // 15 point system
    getMahonyStandings();

    weekNumber += 1;
  } catch (err) {
    console.log(`Stopped on week ${weekNumber}`);
    weekNumber = -1;
  }
}
