import { ITeam } from "../models/allModels";

export const calculateHomeHdcp = (awayAvg: number, homeAvg: number, percentage: number): number => {
  const hdcp_percentage = percentage / 100,
    hdcp = Math.floor(Math.abs(awayAvg - homeAvg) * hdcp_percentage);
  
  return homeAvg > awayAvg ? hdcp * -1 : hdcp;
};

export const calculateTeamPoints = (awayTeam: ITeam, homeTeam: ITeam, pointsPerGame: number, pointsForTotal: number, allowBonusPoint = false): {awayTeamPoints: number, homeTeamPoints: number} => {
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
  
  const homeTeamHdcp = calculateHomeHdcp(awayTeamAvg, homeTeamAvg, 90),
    awayTeamTotal = awayTeamGame1 + awayTeamGame2 + awayTeamGame3,
    homeTeamTotal = homeTeamGame1 + homeTeamGame2 + homeTeamGame3 + (homeTeamHdcp * 3);
  
  let bonusPointGame1 = 0,
    bonusPointGame2 = 0,
    bonusPointGame3 = 0;

  // Game 1
  if (allowBonusPoint && Math.abs(homeTeamGame1 + homeTeamHdcp - awayTeamGame1) >= 125) {
    bonusPointGame1 = 1;
  }
  
  if ((homeTeamGame1 + homeTeamHdcp) > awayTeamGame1) {
    homeTeamPoints += pointsPerGame + bonusPointGame1;    
  } else if ((homeTeamGame1 + homeTeamHdcp) < awayTeamGame1) {
    awayTeamPoints += pointsPerGame + bonusPointGame1;
  } else {
    awayTeamPoints += pointsPerGame/2;
    homeTeamPoints += pointsPerGame/2;
  }
  
  // Game 2
  if (allowBonusPoint && Math.abs(homeTeamGame2 + homeTeamHdcp - awayTeamGame2) >= 125) {
    bonusPointGame2 = 1;
  }
  
  if ((homeTeamGame2 + homeTeamHdcp) > awayTeamGame2) {
    homeTeamPoints += pointsPerGame + bonusPointGame2;
  } else if ((homeTeamGame2 + homeTeamHdcp) < awayTeamGame2) {
    awayTeamPoints += pointsPerGame + bonusPointGame2;
  } else {
    awayTeamPoints += pointsPerGame/2;
    homeTeamPoints += pointsPerGame/2;
  }
  
  // Game 3
  if (allowBonusPoint && Math.abs(homeTeamGame3 + homeTeamHdcp - awayTeamGame3) >= 125) {
    bonusPointGame3 = 1;
  }
  
  if ((homeTeamGame3 + homeTeamHdcp) > awayTeamGame3) {
    homeTeamPoints += pointsPerGame + bonusPointGame3;
  } else if ((homeTeamGame3 + homeTeamHdcp) < awayTeamGame3) {
    awayTeamPoints += pointsPerGame + bonusPointGame3;
  } else {
    awayTeamPoints += pointsPerGame/2;
    homeTeamPoints += pointsPerGame/2;
  }
  
  // Total
  if (homeTeamTotal > awayTeamTotal) {
    homeTeamPoints += pointsForTotal;
  } else if (homeTeamTotal < awayTeamTotal) {
    awayTeamPoints += pointsForTotal;
  } else {
    awayTeamPoints += pointsForTotal/2;
    homeTeamPoints += pointsForTotal/2;
  }
  
  return { awayTeamPoints, homeTeamPoints };
};
