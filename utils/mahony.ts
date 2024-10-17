import { IPlayer, IPoints, IStanding, IStandings, ITeam } from '../models/allModels';
import { calculateHomeHdcp, calculateTeamPoints } from './shared';

const POINTS_PER_GAME = {
    TEAM: 3
  },
  POINTS_FOR_TOTAL = {
    INDIVIDUAL: 1,
    TEAM: 1
  };

const calculateIndividualPoints = (awayPlayer: IPlayer, homePlayer: IPlayer): {awayPlayerPoints: number, homePlayerPoints: number} => {
  let awayPlayerPoints = 0,
    homePlayerPoints = 0;

  const homePlayerHdcp = calculateHomeHdcp(awayPlayer.avg, homePlayer.avg, 90);

  if ((homePlayer.total + (homePlayerHdcp * 3)) > awayPlayer.total) {
    homePlayerPoints += POINTS_FOR_TOTAL.INDIVIDUAL;
  } else if ((homePlayer.total + (homePlayerHdcp * 3)) < awayPlayer.total) {
    awayPlayerPoints += POINTS_FOR_TOTAL.INDIVIDUAL;
  } else {
    awayPlayerPoints += POINTS_FOR_TOTAL.INDIVIDUAL/2;
    homePlayerPoints += POINTS_FOR_TOTAL.INDIVIDUAL/2;
  }

  return { awayPlayerPoints, homePlayerPoints };
}

export const getMahonyStandings = (awayTeam: ITeam, homeTeam: ITeam): IPoints => {
  let awayPoints = 0,
    homePoints = 0;
  
  let player = 0;
  while (player < awayTeam.roster.length) {
    const { awayPlayerPoints, homePlayerPoints } = calculateIndividualPoints(awayTeam.roster[player], homeTeam.roster[player]);

    awayPoints += awayPlayerPoints;
    homePoints += homePlayerPoints;

    player += 1;
  }
  
  const { awayTeamPoints, homeTeamPoints } = calculateTeamPoints(awayTeam, homeTeam, POINTS_PER_GAME.TEAM, POINTS_FOR_TOTAL.TEAM);

  awayPoints += awayTeamPoints;
  homePoints += homeTeamPoints;

  return {
    awayPoints,
    homePoints
  };
};

export const sortAndDisplay = (standings: IStandings): void => {
  const standingsArray: [number, IStanding][] = Object.entries(standings) as any;

  standingsArray.sort((a: [number, IStanding], b: [number, IStanding]): number => {
    if (a[1].mahony_points > b[1].mahony_points) {
      return -1;
    } else if (a[1].mahony_points < b[1].mahony_points) {
      return 1;
    }

    return 0;
  });

  const sortedStandings: {[key: number]: {}} = {};

  let x = 0;
  while (x < standingsArray.length) {
    sortedStandings[x+1] = {
      Team: `${(standingsArray[x][0]+'   ').slice(0, 2)} - ${standingsArray[x][1].team_name}`,
      Points: standingsArray[x][1].mahony_points
    };

    x += 1;
  }

  console.log('Mahony Standings:');
  console.log('-------------------');
  console.table(sortedStandings);
};
