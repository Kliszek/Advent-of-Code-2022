import * as fs from 'fs';
import * as readline from 'readline';

type Point = [number, number];

function createRope(length: number): Point[] {
  // rope.fill() wouldn't work here, because the array would be filled with the reference to the same point
  const rope: Point[] = [];
  for (let i = 0; i < length; i++) {
    rope[i] = [0, 0];
  }
  return rope;
}

// Calculates the tail position after a head move.
// Assumes that the tail position was correct before the head moved.
function handleKnotMove(head: Point, tail: Point): void {
  const vector = [head[0] - tail[0], head[1] - tail[1]];
  // Does the tail need to be moved at all?
  if (Math.abs(vector[0]) > 1 || Math.abs(vector[1]) > 1) {
    // Move it 1 unit closer to the head in each axis
    const moveVector = vector.map((d) => Math.sign(d));
    tail[0] += moveVector[0];
    tail[1] += moveVector[1];
  }
}

function updateRope(rope: Point[]): void {
  for (let i = 1; i < rope.length; i++) {
    handleKnotMove(rope[i - 1], rope[i]);
  }
}

function getTailPositionString(rope: Point[]): string {
  return `${rope[rope.length - 1][0]},${rope[rope.length - 1][1]}`;
}

async function day9(): Promise<void> {
  const inputFile = fs.createReadStream('./day9/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  const rope1 = createRope(2);
  const rope2 = createRope(10);

  const tailMap1: Record<string, true> = { '0,0': true };
  const tailMap2: Record<string, true> = { '0,0': true };

  for await (const inputLine of inputLines) {
    const [direction, m] = inputLine.split(' ');
    const moves = parseInt(m);
    for (let i = 0; i < moves; i++) {
      switch (direction) {
        case 'U':
          rope1[0][1]++;
          rope2[0][1]++;
          break;
        case 'R':
          rope1[0][0]++;
          rope2[0][0]++;
          break;
        case 'D':
          rope1[0][1]--;
          rope2[0][1]--;
          break;
        case 'L':
          rope1[0][0]--;
          rope2[0][0]--;
          break;
      }
      updateRope(rope1);
      updateRope(rope2);
      tailMap1[getTailPositionString(rope1)] = true;
      tailMap2[getTailPositionString(rope2)] = true;
    }
  }

  console.log(
    `Short rope's tail visited ${Object.keys(tailMap1).length} positions`,
  );
  console.log(
    `Long rope's tail visited ${Object.keys(tailMap2).length} positions`,
  );
}

day9();
