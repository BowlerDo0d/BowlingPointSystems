import { ISchedule, IStandings, ITeam } from './models/allModels';
import { getMahonyStandings, sortAndDisplay as sortAndDisplayMahony } from './utils/mahony';
import { getPetersonStandings, sortAndDisplay as sortAndDisplayPeterson } from './utils/peterson';
import { getTraditionalStandings, sortAndDisplay as sortAndDisplayTraditional } from './utils/traditional';

const { readFileSync } = require('fs');

const schedule: ISchedule[] = JSON.parse(readFileSync('recaps/schedule.json', 'utf-8')),
  standings: IStandings = {};

const updateStandings = (team_number: number, points: number, system: 'Mahony' | 'Peterson' | 'Traditional'): void => {
  const currentPoints = {...standings[team_number]};

  switch (system) {
    case 'Mahony':
      currentPoints.mahony_points += points;
      break;
    case 'Peterson':
      currentPoints.peterson_points += points;
      break;
    case 'Traditional':
      currentPoints.traditional_points += points;
      break;
  }

  standings[team_number] = {...currentPoints};
};

const calucluate = (): void => {
  let weekNumber = 1;
  while (weekNumber > 0) {
    try {
      const weekRecap: ITeam[] = JSON.parse(readFileSync(`recaps/week${weekNumber}.json`, 'utf-8'));

      let pairing = 0;
      while (pairing < schedule[weekNumber].pairings.length) {
        const awayTeamNumber = schedule[weekNumber].pairings[pairing].away,
          awayTeam: ITeam = weekRecap[awayTeamNumber - 1],
          homeTeamNumber = schedule[weekNumber].pairings[pairing].home,
          homeTeam: ITeam = weekRecap[homeTeamNumber - 1];

        if (weekNumber === 1) {
          standings[awayTeamNumber] = {
            team_name: awayTeam.team_name,
            mahony_points: 0,
            peterson_points: 0,
            traditional_points: 0
          };

          standings[homeTeamNumber] = {
            team_name: homeTeam.team_name,
            mahony_points: 0,
            peterson_points: 0,
            traditional_points: 0
          };
        }

        // 35 point system
        const { awayPoints: pAwayPoints, homePoints: pHomePoints } = getPetersonStandings(awayTeam, homeTeam);
        
        updateStandings(awayTeamNumber, pAwayPoints, 'Peterson');
        updateStandings(homeTeamNumber, pHomePoints, 'Peterson');
        
        // 7 point system
        const { awayPoints: tAwayPoints, homePoints: tHomePoints } = getTraditionalStandings(awayTeam, homeTeam);
        
        updateStandings(awayTeamNumber, tAwayPoints, 'Traditional');
        updateStandings(homeTeamNumber, tHomePoints, 'Traditional');
        
        // 15 point system
        const { awayPoints: mAwayPoints, homePoints: mHomePoints } = getMahonyStandings(awayTeam, homeTeam);
        
        updateStandings(awayTeamNumber, mAwayPoints, 'Mahony');
        updateStandings(homeTeamNumber, mHomePoints, 'Mahony');

        pairing += 1;
      }

      weekNumber += 1;
    } catch (err) {
      console.log(`Results after week ${weekNumber - 1}\n\n`);
      weekNumber = -1;
    }
  }
};

calucluate();
sortAndDisplayPeterson(standings);
sortAndDisplayTraditional(standings);
sortAndDisplayMahony(standings);
