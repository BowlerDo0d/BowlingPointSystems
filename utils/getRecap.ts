const { readFileSync } = require('fs');

export default function readRecapFile(week: number): string {
    return readFileSync(`recaps/week${week}.csv`, 'utf-8');
}
