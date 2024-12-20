import { IPairing, IPlayer, IPoints, IStanding, IStandings, ITeam } from '../models/allModels';
import { calculateHomeHdcp, calculateTeamPoints } from './shared';

const POINTS_PER_GAME = {
    INDIVIDUAL: 1,
    TEAM: 2
  },
  POINTS_FOR_TOTAL = {
    INDIVIDUAL: 2,
    TEAM: 4
  };

const calculateIndividualPoints = (awayPlayer: IPlayer, homePlayer: IPlayer): {awayPlayerPoints: number, homePlayerPoints: number} => {
  let awayPlayerPoints = 0,
    homePlayerPoints = 0;

  const homePlayerHdcp = calculateHomeHdcp(awayPlayer.avg, homePlayer.avg, 90);

  if ((homePlayer.game1 + homePlayerHdcp) > awayPlayer.game1) {
    homePlayerPoints += POINTS_PER_GAME.INDIVIDUAL;
  } else if ((homePlayer.game1 + homePlayerHdcp) < awayPlayer.game1) {
    awayPlayerPoints += POINTS_PER_GAME.INDIVIDUAL;
  } else {
    awayPlayerPoints += POINTS_PER_GAME.INDIVIDUAL/2;
    homePlayerPoints += POINTS_PER_GAME.INDIVIDUAL/2;
  }

  if ((homePlayer.game2 + homePlayerHdcp) > awayPlayer.game2) {
    homePlayerPoints += POINTS_PER_GAME.INDIVIDUAL;
  } else if ((homePlayer.game2 + homePlayerHdcp) < awayPlayer.game2) {
    awayPlayerPoints += POINTS_PER_GAME.INDIVIDUAL;
  } else {
    awayPlayerPoints += POINTS_PER_GAME.INDIVIDUAL/2;
    homePlayerPoints += POINTS_PER_GAME.INDIVIDUAL/2;
  }

  if ((homePlayer.game3 + homePlayerHdcp) > awayPlayer.game3) {
    homePlayerPoints += POINTS_PER_GAME.INDIVIDUAL;
  } else if ((homePlayer.game3 + homePlayerHdcp) < awayPlayer.game3) {
    awayPlayerPoints += POINTS_PER_GAME.INDIVIDUAL;
  } else {
    awayPlayerPoints += POINTS_PER_GAME.INDIVIDUAL/2;
    homePlayerPoints += POINTS_PER_GAME.INDIVIDUAL/2;
  }

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

export const getPetersonStandings = (awayTeam: ITeam, homeTeam: ITeam): IPoints => {
  let awayPoints = 0,
    homePoints = 0;
  
  let player = 0;
  while (player < awayTeam.roster.length) {
    const { awayPlayerPoints, homePlayerPoints } = calculateIndividualPoints(awayTeam.roster[player], homeTeam.roster[player]);

    awayPoints += awayPlayerPoints;
    homePoints += homePlayerPoints;

    player += 1;
  }
  
  const { awayTeamPoints, awayTotalPins, homeTeamPoints, homeTotalPins } = calculateTeamPoints(awayTeam, homeTeam, POINTS_PER_GAME.TEAM, POINTS_FOR_TOTAL.TEAM);

  awayPoints += awayTeamPoints;
  homePoints += homeTeamPoints;

  return {
    awayPoints,
    awayTotalPins,
    homePoints,
    homeTotalPins
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
    if (a[1].peterson_points > b[1].peterson_points) {
      return -1;
    } else if (a[1].peterson_points < b[1].peterson_points) {
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
      Points: standingsArray[x][1].peterson_points,
      'Total Pins': standingsArray[x][1].total_pins
    };

    x += 1;
  }

  console.log('Peterson Standings:');
  console.log('-------------------');
  console.table(sortedStandings);
};
