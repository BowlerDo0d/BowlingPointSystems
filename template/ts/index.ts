import getInput from '../../../utils/getInput';

const pathParts = __dirname.split('/'),
  day = pathParts?.length ? pathParts[pathParts.length-1] : '',
  year = pathParts?.length ? pathParts[pathParts.length-2] : '',
  fullInput = getInput(year, day);

const part1 = (input: string) => {

}

const part2 = (input: string) => {

}

console.log(`Solution 1: ${part1(fullInput)}`);
console.log(`Solution 2: ${part2(fullInput)}`);