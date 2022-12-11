import * as fs from 'fs';
import * as readline from 'readline';

enum Command {
  ADDX = 'addx',
  NOOP = 'noop',
}

const CommandDuration: Record<Command, number> = {
  addx: 2,
  noop: 1,
};

type Instruction = { command: Command; arguments: any[] };

async function day10(): Promise<void> {
  const inputFile = fs.createReadStream('./day10/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  const stack: Instruction[] = [];
  const processing: Instruction[][] = [];

  for await (const inputLine of inputLines) {
    const input = inputLine.split(' ');
    stack.push({
      command: input[0] as Command,
      arguments: input.slice(1),
    });
  }

  let xReg = 1;
  let cycle = 0;
  let crt = 0;

  function handleInstruction(instruction: Instruction) {
    switch (instruction.command) {
      case Command.NOOP:
        break;
      case Command.ADDX:
        xReg += parseInt(instruction.arguments[0]);
        break;
    }
  }

  let sum = 0;
  let image = '';
  while (stack.length > 0 || processing.length > 0) {
    cycle++;
    image += crt === 0 ? '\n' : '';

    // if no instruction is pending, start execution of new instruction
    if (processing.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const instructionToDo = stack.shift()!;
      const idx = CommandDuration[instructionToDo.command] - 1;
      (processing[idx] ??= []).push(instructionToDo);
    }

    //handle cycle
    if ((cycle + 20) % 40 === 0 && cycle <= 220) {
      sum += cycle * xReg;
    }
    const drawPixel = crt - xReg === 0 || Math.abs(crt - xReg) === 1;
    image += drawPixel ? '#' : '.';

    // cycle ends, process pending instructions
    const instructionsToProcess = processing.shift() ?? [];
    instructionsToProcess.forEach((i) => handleInstruction(i));
    crt = (crt + 1) % 40;
  }

  console.log(`The sum of signal strengths is ${sum}`);
  console.log(image);
}

day10();
