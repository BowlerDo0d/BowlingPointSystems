import { IPairing, IPoints, IStanding, IStandings, ITeam } from '../models/allModels';
import { calculateTeamPoints } from './shared';

const POINTS_PER_GAME = 2,
  POINTS_FOR_TOTAL = 1;

export const getTraditionalStandings = (awayTeam: ITeam, homeTeam: ITeam): IPoints => {
  let awayPoints = 0,
    homePoints = 0;
  
  const { awayTeamPoints, homeTeamPoints } = calculateTeamPoints(awayTeam, homeTeam, POINTS_PER_GAME, POINTS_FOR_TOTAL, true);

  awayPoints += awayTeamPoints;
  homePoints += homeTeamPoints;

  return {
    awayPoints,
    awayTotalPins: 0,
    homePoints,
    homeTotalPins: 0
  };
};

export const generatePostionRound = (standings: IStandings): IPairing[] => {
  const sortedStandings = [...sortTeams(standings)],
    pairings: IPairing[] = [];

  let position = 0;
  while (position < 32) {
    pairings.push({
      away: sortedStandings[position][1].team_number,
      home: sortedStandings[position + 1][1].team_number
    });

    position += 2;
  }

  return pairings;
};

export const sortTeams = (standings: IStandings): [number, IStanding][] => {
  const standingsArray: [number, IStanding][] = Object.entries(standings) as any;
  
  standingsArray.sort((a: [number, IStanding], b: [number, IStanding]): number => {
    if (a[1].traditional_points > b[1].traditional_points) {
      return -1;
    } else if (a[1].traditional_points < b[1].traditional_points) {
      return 1;
    }
    
    if (a[1].total_pins > b[1].total_pins) {
      return -1;
    } else if (a[1].total_pins < b[1].total_pins) {
      return 1;
    }

    return 0;
  });

  return standingsArray;
}

export const sortAndDisplay = (standings: IStandings): void => {
  const standingsArray = sortTeams(standings);
  const sortedStandings: {[key: number]: {}} = {};

  let x = 0;
  while (x < standingsArray.length) {
    sortedStandings[x+1] = {
      Team: `${(standingsArray[x][0]+'   ').slice(0, 2)} - ${standingsArray[x][1].team_name}`,
      Points: standingsArray[x][1].traditional_points,
      'Total Pins': standingsArray[x][1].total_pins
    };

    x += 1;
  }

  console.log('Traditional Standings:');
  console.log('-------------------');
  console.table(sortedStandings);
};
