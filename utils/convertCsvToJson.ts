import { Team } from '../models/allModels';

const { readFileSync, writeFile } = require('fs');

try {
  const weekNumber = process.argv[2];

  if (!weekNumber) {
    throw new Error('Please provide a value for the week number to convert');
  }

  const recap: string[] = readFileSync(`recaps/week${weekNumber}.csv`, 'utf-8').replace(/\r/g, '').split('\n'),
    allTeams = [];

  let nextTeam: Team = {
    team_number: 0,
    team_name: '',
    roster: []
  };

  let idx = 0;
  while (idx < recap.length) {
    const player = recap[idx].replace(new RegExp(/"(.*)"/g), (match) => match.replace(',', ';')).split(',');

    if (idx % 5 === 0) {
      // Start next team
      nextTeam = {
        team_number: +player[2],
        team_name: player[3],
        roster: []
      };
    }

    let formattedName = player[1];

    if (formattedName.indexOf(';') !== -1) {
      const names = formattedName.replace(new RegExp(/([^a-zA-Z;])/g), '').split(';');

      formattedName = `${names[1]} ${names[0]}`;
    }

    nextTeam.roster.push({
      name: formattedName,
      avg: +player[4],
      game1: +player[6],
      game2: +player[7],
      game3: +player[8],
      total: +player[9]
    });

    if (idx % 5 === 4) {
      allTeams.push(nextTeam);
    }

    idx += 1;
  }

  const jsonData = JSON.stringify(allTeams, null, 2);

  writeFile(`recaps/week${weekNumber}.json`, jsonData, (err: any) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log(`JSON file has been saved as week${weekNumber}.json`);
    }
  });
} catch (error) {
  console.error('Error occurred: ', error);
}
