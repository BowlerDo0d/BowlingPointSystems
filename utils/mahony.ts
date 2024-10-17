import { IPoints, ITeam } from "../models/allModels";

export const getMahonyStandings = (awayTeam: ITeam, homeTeam: ITeam): IPoints => {
  return {
    awayPoints: 3,
    homePoints: 12
  };
};
