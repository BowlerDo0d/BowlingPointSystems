export interface IPlayer {
  name: string;
  avg: number;
  game1: number;
  game2: number;
  game3: number;
  total: number;
}

export interface ITeam {
  team_number: number;
  team_name: string;
  roster: IPlayer[]
}
