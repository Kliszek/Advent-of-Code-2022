import * as fs from 'fs';
import * as readline from 'readline';

type Range = [number, number];

function rangesOverlap(range1: Range, range2: Range): boolean {
  return (
    (range2[1] >= range1[0] &&
      (range2[1] <= range1[1] || range1[0] >= range2[1])) ||
    (range1[1] >= range2[0] &&
      (range2[1] >= range1[1] || range1[0] <= range2[1]))
  );
}

function rangesContains(range1: Range, range2: Range): boolean {
  return (
    range1[1] >= range2[0] &&
    range2[1] >= range1[0] &&
    ((range2[0] >= range1[0] && range2[1] <= range1[1]) ||
      (range2[0] <= range1[0] && range2[1] >= range1[1]))
  );
}

async function day4(): Promise<void> {
  const inputFile = fs.createReadStream('./day4/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  let sum1 = 0;
  let sum2 = 0;
  for await (const inputLine of inputLines) {
    const [elf1, elf2] = inputLine.split(',');
    const elf1Range = elf1.split('-').map((r) => parseInt(r)) as Range;
    const elf2Range = elf2.split('-').map((r) => parseInt(r)) as Range;

    if (rangesContains(elf1Range, elf2Range)) {
      sum1++;
    }

    if (rangesOverlap(elf1Range, elf2Range)) {
      sum2++;
    }
  }

  console.log(`The answer is ${sum1}`);
  console.log(`The answer is ${sum2}`);
}

day4();
