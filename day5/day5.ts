import * as fs from 'fs';
import * as readline from 'readline';

function moveOneAtOnce(
  array: Array<Array<string>>,
  count: number,
  from: number,
  to: number,
): void {
  for (let i = 0; i < count; i++) {
    const crateToMove = array[from - 1].shift();
    if (!crateToMove) throw new Error('No crate to move!');
    array[to - 1].unshift(crateToMove);
  }
}

function moveManyAtOnce(
  array: Array<Array<string>>,
  count: number,
  from: number,
  to: number,
): void {
  const cratesToMove = array[from - 1].splice(0, count);
  if (!cratesToMove) throw new Error('No crate to move!');
  array[to - 1].unshift(...cratesToMove);
}

async function day5(): Promise<void> {
  const inputFile = fs.createReadStream('./day5/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  const cratesMap1: Array<Array<string>> = [];
  const cratesMap2: Array<Array<string>> = [];

  // Phase 1 is reading the crate map,
  // phase 2 is reading and performing the moves.
  let phase = 1;
  for await (const inputLine of inputLines) {
    if (inputLine === '') continue;
    if (inputLine.startsWith(' 1 ')) {
      phase = 2;
      continue;
    }
    if (phase === 1) {
      // .replace() removes every fourth character from the string
      // .match() divides the string into array of strings of lengths 3
      const crates = inputLine.replace(/(.{3})./g, '$1').match(/.{1,3}/g) ?? [];

      crates.forEach((crate, index) => {
        if (crate[1] !== ' ') {
          cratesMap1[index] ??= [];
          cratesMap1[index].push(crate[1]);
          cratesMap2[index] ??= [];
          cratesMap2[index].push(crate[1]);
        }
      });
    } else if (phase === 2) {
      const [count, from, to] = inputLine
        .replace(/move |from |to /g, '')
        .split(' ')
        .map((n) => parseInt(n));

      moveOneAtOnce(cratesMap1, count, from, to);
      moveManyAtOnce(cratesMap2, count, from, to);
    }
  }

  const answer1 = cratesMap1.map((c) => c[0]).join('');
  const answer2 = cratesMap2.map((c) => c[0]).join('');
  console.log(`For CrateMover 9000, the crates on top are ${answer1}`);
  console.log(`For CrateMover 9001, the crates on top are ${answer2}`);
}

day5();
