import * as fs from 'fs';
import * as readline from 'readline';

type Point = [number, number];

async function day14(): Promise<void> {
  const inputFile = fs.createReadStream('./day14/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  let lowestElevation = 0;
  const caveMap1: Array<Array<string>> = [];
  const caveMap2: Array<Array<string>> = [];
  for await (const inputLine of inputLines) {
    const points = inputLine
      .split(' -> ')
      .map((p) => p.split(',').map((n) => parseInt(n))) as Point[];

    if (points[0][1] > lowestElevation) lowestElevation = points[0][1];
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      if (p2[1] > lowestElevation) lowestElevation = p2[1];
      const dInd = p1[0] - p2[0] === 0 ? 1 : 0;
      const dVec = p1[dInd] < p2[dInd] ? 1 : -1;
      while (p1[dInd] !== p2[dInd]) {
        (caveMap1[p1[0]] ??= [])[p1[1]] = '#';
        (caveMap2[p1[0]] ??= [])[p1[1]] = '#';
        p1[dInd] += dVec;
      }
      (caveMap1[p1[0]] ??= [])[p1[1]] = '#';
      (caveMap2[p1[0]] ??= [])[p1[1]] = '#';
    }
  }

  // simulation 1 / sand falling into the void
  const isRock1 = (x: number, y: number) => caveMap1[x]?.[y];
  let sandUnits1 = 0;
  while (true) {
    const currentPosition: Point = [500, 0];
    while (true) {
      if (currentPosition[1] > lowestElevation) break;
      if (!isRock1(currentPosition[0], currentPosition[1] + 1)) {
        currentPosition[1]++;
      } else if (!isRock1(currentPosition[0] - 1, currentPosition[1] + 1)) {
        currentPosition[0]--;
        currentPosition[1]++;
      } else if (!isRock1(currentPosition[0] + 1, currentPosition[1] + 1)) {
        currentPosition[0]++;
        currentPosition[1]++;
      } else {
        caveMap1[currentPosition[0]] ??= [];
        caveMap1[currentPosition[0]][currentPosition[1]] = 'O';
        sandUnits1++;
        break;
      }
    }
    if (currentPosition[1] > lowestElevation) break;
  }

  // simulation 2 / sand falling onto the floor
  // it's a brute force, but it's almost instant
  const isRock2 = (x: number, y: number) =>
    y >= lowestElevation + 2 || caveMap2[x]?.[y];
  let sandUnits2 = 0;
  while (true) {
    const currentPosition = [500, 0];
    while (true) {
      if (!isRock2(currentPosition[0], currentPosition[1] + 1)) {
        currentPosition[1]++;
      } else if (!isRock2(currentPosition[0] - 1, currentPosition[1] + 1)) {
        currentPosition[0]--;
        currentPosition[1]++;
      } else if (!isRock2(currentPosition[0] + 1, currentPosition[1] + 1)) {
        currentPosition[0]++;
        currentPosition[1]++;
      } else {
        caveMap2[currentPosition[0]] ??= [];
        caveMap2[currentPosition[0]][currentPosition[1]] = 'O';
        sandUnits2++;
        break;
      }
    }
    if (currentPosition[0] === 500 && currentPosition[1] === 0) break;
  }

  console.log(
    `Sand units that will come to rest before they start falling into the void: ${sandUnits1}`,
  );
  console.log(
    `Sand units that will come to rest before they will block the source: ${sandUnits2}`,
  );
}

day14();
