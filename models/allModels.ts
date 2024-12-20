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

export interface IPoints {
  awayPoints: number;
  awayTotalPins: number;
  homePoints: number;
  homeTotalPins: number;
}

export interface IPairing {
  away: number;
  home: number;
}

export interface ISchedule {
  week: number;
  pairings: IPairing[]
}

export interface IStanding {
  team_number: number;
  team_name: string;
  mahony_points: number;
  peterson_points: number;
  traditional_points: number;
  total_pins: number;
}

export interface IStandings {
  [key: number]: IStanding
}
