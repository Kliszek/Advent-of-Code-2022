import * as fs from 'fs';
import * as readline from 'readline';

function detectPacket(data: string, length: number): number {
  // hash map
  const detectedChars: Record<string, number> = {};

  let start = 0;
  let end = 0;
  while (end - start < length) {
    if (detectedChars[data[end]] >= start) {
      start = detectedChars[data[end]] + 1;
      detectedChars[data[end]] = end;
    } else {
      detectedChars[data[end]] = end;
    }
    end++;
  }
  return end;
}

async function day6(): Promise<void> {
  const inputFile = fs.createReadStream('./day6/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  let answer1 = -1;
  let answer2 = -1;
  for await (const inputLine of inputLines) {
    answer1 = detectPacket(inputLine, 4);
    answer2 = detectPacket(inputLine, 14);
  }

  console.log(`Characters before start-of-packet marker: ${answer1}`);
  console.log(`Characters before start-of-message marker: ${answer2}`);
}

day6();
