import { IPlayer, IPoints, ITeam } from '../models/allModels';

const POINTS_PER_GAME = {
    INDIVIDUAL: 1,
    TEAM: 2
  },
  POINTS_FOR_TOTAL = {
    INDIVIDUAL: 2,
    TEAM: 4
  };

const calculateHomeHdcp = (awayAvg: number, homeAvg: number): number => {
  const HDCP_PERCENTAGE = 0.9; // 90%

  const hdcp = Math.floor(Math.abs(awayAvg - homeAvg) * HDCP_PERCENTAGE);

  return homeAvg > awayAvg ? hdcp * -1 : hdcp;
};

const calculateTeamPoints = (awayTeam: ITeam, homeTeam: ITeam): {awayTeamPoints: number, homeTeamPoints: number} => {
  let awayTeamAvg = 0,
    awayTeamGame1 = 0,
    awayTeamGame2 = 0,
    awayTeamGame3 = 0,
    awayTeamPoints = 0,
    homeTeamAvg = 0,
    homeTeamGame1 = 0,
    homeTeamGame2 = 0,
    homeTeamGame3 = 0,
    homeTeamPoints = 0;

  let player = 0;
  while (player < awayTeam.roster.length) {
    const awayPlayer = awayTeam.roster[player],
      homePlayer = homeTeam.roster[player];

    awayTeamAvg += awayPlayer.avg;
    homeTeamAvg += homePlayer.avg;

    awayTeamGame1 += awayPlayer.game1;
    homeTeamGame1 += homePlayer.game1;

    awayTeamGame2 += awayPlayer.game2;
    homeTeamGame2 += homePlayer.game2;

    awayTeamGame3 += awayPlayer.game3;
    homeTeamGame3 += homePlayer.game3;
    
    player += 1;
  }
  
  const homeTeamHdcp = calculateHomeHdcp(awayTeamAvg, homeTeamAvg),
    awayTeamTotal = awayTeamGame1 + awayTeamGame2 + awayTeamGame3,
    homeTeamTotal = homeTeamGame1 + homeTeamGame2 + homeTeamGame3 + (homeTeamHdcp * 3);

  // Game 1
  if ((homeTeamGame1 + homeTeamHdcp) > awayTeamGame1) {
    homeTeamPoints += POINTS_PER_GAME.TEAM;
  } else if ((homeTeamGame1 + homeTeamHdcp) < awayTeamGame1) {
    awayTeamPoints += POINTS_PER_GAME.TEAM;
  } else {
    awayTeamPoints += POINTS_PER_GAME.TEAM/2;
    homeTeamPoints += POINTS_PER_GAME.TEAM/2;
  }
  
  // Game 2
  if ((homeTeamGame2 + homeTeamHdcp) > awayTeamGame2) {
    homeTeamPoints += POINTS_PER_GAME.TEAM;
  } else if ((homeTeamGame2 + homeTeamHdcp) < awayTeamGame2) {
    awayTeamPoints += POINTS_PER_GAME.TEAM;
  } else {
    awayTeamPoints += POINTS_PER_GAME.TEAM/2;
    homeTeamPoints += POINTS_PER_GAME.TEAM/2;
  }
  
  // Game 3
  if ((homeTeamGame3 + homeTeamHdcp) > awayTeamGame3) {
    homeTeamPoints += POINTS_PER_GAME.TEAM;
  } else if ((homeTeamGame3 + homeTeamHdcp) < awayTeamGame3) {
    awayTeamPoints += POINTS_PER_GAME.TEAM;
  } else {
    awayTeamPoints += POINTS_PER_GAME.TEAM/2;
    homeTeamPoints += POINTS_PER_GAME.TEAM/2;
  }
  
  // Total
  if (homeTeamTotal > awayTeamTotal) {
    homeTeamPoints += POINTS_FOR_TOTAL.TEAM;
  } else if (homeTeamTotal < awayTeamTotal) {
    awayTeamPoints += POINTS_FOR_TOTAL.TEAM;
  } else {
    awayTeamPoints += POINTS_FOR_TOTAL.TEAM/2;
    homeTeamPoints += POINTS_FOR_TOTAL.TEAM/2;
  }
  
  return { awayTeamPoints, homeTeamPoints };
};

const calculateIndividualPoints = (awayPlayer: IPlayer, homePlayer: IPlayer): {awayPlayerPoints: number, homePlayerPoints: number} => {
  let awayPlayerPoints = 0,
    homePlayerPoints = 0;

  const homePlayerHdcp = calculateHomeHdcp(awayPlayer.avg, homePlayer.avg);

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
    awayPlayerPoints += 2;
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
  
  const { awayTeamPoints, homeTeamPoints } = calculateTeamPoints(awayTeam, homeTeam);

  awayPoints += awayTeamPoints;
  homePoints += homeTeamPoints;

  console.log(`${awayTeam.team_name} vs. ${homeTeam.team_name}`);
  console.log(`${awayPoints} - ${homePoints}\n`);

  return {
    awayPoints,
    homePoints
  };
};
