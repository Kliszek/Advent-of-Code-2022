import * as fs from 'fs';
import * as readline from 'readline';

function calculatePriority(char: string): number {
  const p = char.charCodeAt(0) - 38;
  return p > 52 ? p - 58 : p;
}

async function day3(): Promise<void> {
  const inputFile = fs.createReadStream('./day3/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  let priorities = 0;
  let badgesSum = 0;

  // Common item types in three rucksacks in the row.
  // First one will have all the item types,
  // second one will only have common items from 1st and 2nd
  // and the third one would be the answer, but we don't need it here
  const commonTypes: [
    Record<string, number>,
    Record<string, number>,
    // Record<string, number>,
  ] = [{}, {}];

  for await (const inputLine of inputLines) {
    const compartment1: Record<string, number> = {};

    for (let i = 0; 2 * i < inputLine.length; i++) {
      compartment1[inputLine[i]] ??= 0;
      compartment1[inputLine[i]]++;
    }
    for (let i = inputLine.length / 2; i < inputLine.length; i++) {
      if (compartment1[inputLine[i]]) {
        priorities += calculatePriority(inputLine[i]);
        break;
      }
    }
    // SECOND PART

    // 1st of 3 rucksacks, fills commonTypes[0]
    if (Object.keys(commonTypes[0]).length === 0) {
      for (let i = 0; i < inputLine.length; i++) {
        commonTypes[0][inputLine[i]] ??= 1;
      }
    }
    // 2nd of 3 rucksacks, fills commonTypes[1]
    else if (Object.keys(commonTypes[1]).length === 0) {
      for (let i = 0; i < inputLine.length; i++) {
        if (commonTypes[0][inputLine[i]]) {
          commonTypes[1][inputLine[i]] ??= 1;
        }
      }
    }
    // 3rd of 3 rucksacks, we clear commonTypes and start again
    else {
      for (let i = 0; i < inputLine.length; i++) {
        if (commonTypes[1][inputLine[i]]) {
          badgesSum += calculatePriority(inputLine[i]);
          commonTypes[0] = {};
          commonTypes[1] = {};
          break;
        }
      }
    }
  }

  console.log(`The sum of the priorities is ${priorities}`);
  console.log(`The sum of the badges is ${badgesSum}`);
}

day3();
