import { ISchedule, IStandings, ITeam } from './models/allModels';
import { getMahonyStandings, sortAndDisplay as sortAndDisplayMahony } from './utils/mahony';
import { generatePostionRound as generateSchedulePeterson, getPetersonStandings, sortAndDisplay as sortAndDisplayPeterson } from './utils/peterson';
import { getTraditionalStandings, sortAndDisplay as sortAndDisplayTraditional } from './utils/traditional';

const { readFileSync } = require('fs');

const schedule: ISchedule[] = JSON.parse(readFileSync('recaps/schedule.json', 'utf-8')),
  standings: IStandings = {};

const updateStandings = (team_number: number, points: number, totalPins: number, system: 'Mahony' | 'Peterson' | 'Traditional'): void => {
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

  currentPoints.total_pins += totalPins;

  standings[team_number] = {...currentPoints};
};

const calucluate = (): void => {
  let weekNumber = 1;
  while (weekNumber > 0) {
    try {
      const weekRecap: ITeam[] = JSON.parse(readFileSync(`recaps/week${weekNumber}.json`, 'utf-8'));

      let weekSchedule = schedule[weekNumber].pairings;
      
      const positionRound = weekSchedule.length === 0;

      if (positionRound) {
        weekSchedule = generateSchedulePeterson(standings);
      }
      
      let pairing = 0;
      while (pairing < weekSchedule.length) {
        const awayTeamNumber = weekSchedule[pairing].away,
          awayTeam: ITeam = weekRecap[awayTeamNumber - 1],
          homeTeamNumber = weekSchedule[pairing].home,
          homeTeam: ITeam = weekRecap[homeTeamNumber - 1];

        if (weekNumber === 1) {
          standings[awayTeamNumber] = {
            team_number: awayTeam.team_number,
            team_name: awayTeam.team_name,
            mahony_points: 0,
            peterson_points: 0,
            traditional_points: 0,
            total_pins: 0
          };
          
          standings[homeTeamNumber] = {
            team_number: homeTeam.team_number,
            team_name: homeTeam.team_name,
            mahony_points: 0,
            peterson_points: 0,
            traditional_points: 0,
            total_pins: 0
          };
        }

        // 35 point system
        const { awayPoints: pAwayPoints, awayTotalPins, homePoints: pHomePoints, homeTotalPins } = getPetersonStandings(awayTeam, homeTeam);
        
        updateStandings(awayTeamNumber, pAwayPoints, awayTotalPins, 'Peterson');
        updateStandings(homeTeamNumber, pHomePoints, homeTotalPins, 'Peterson');
        
        // 7 point system
        const { awayPoints: tAwayPoints, homePoints: tHomePoints } = getTraditionalStandings(awayTeam, homeTeam);
        
        updateStandings(awayTeamNumber, tAwayPoints, 0, 'Traditional');
        updateStandings(homeTeamNumber, tHomePoints, 0, 'Traditional');
        
        // 15 point system
        const { awayPoints: mAwayPoints, homePoints: mHomePoints } = getMahonyStandings(awayTeam, homeTeam);
        
        updateStandings(awayTeamNumber, mAwayPoints, 0, 'Mahony');
        updateStandings(homeTeamNumber, mHomePoints, 0, 'Mahony');

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
