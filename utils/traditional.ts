import { IPoints, ITeam } from "../models/allModels";

export const getTraditionalStandings = (awayTeam: ITeam, homeTeam: ITeam): IPoints => {
  return {
    awayPoints: 3,
    homePoints: 4
  };
};
