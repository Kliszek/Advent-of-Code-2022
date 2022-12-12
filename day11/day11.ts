import * as fs from 'fs';
import * as readline from 'readline';

class Monkey {
  items: number[];
  operation: (old: number) => number;
  test: (worryLevel: number) => boolean;
  ifFalse: number;
  ifTrue: number;

  timesInspected: number;

  constructor() {
    this.items = [];
    this.operation = () => 0;
    this.test = () => false;
    this.ifFalse = 0;
    this.ifTrue = 0;
    this.timesInspected = 0;
  }

  makeTurn(divideWorryLevel = true): { item: number; throwTo: number }[] {
    const itemsToThrow: { item: number; throwTo: number }[] = [];

    while (this.items.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let item = this.items.shift()!;
      // inspection
      item = this.operation(item);
      this.timesInspected++;
      // getting bored
      if (divideWorryLevel) {
        item = Math.floor(item / 3);
      }
      // test
      if (this.test(item)) {
        itemsToThrow.push({ item, throwTo: this.ifTrue });
      } else {
        itemsToThrow.push({ item, throwTo: this.ifFalse });
      }
    }
    return itemsToThrow;
  }

  backupItems(): number[] {
    const items: number[] = [];
    this.items.forEach((i) => items.push(i));
    return items;
  }

  resetMonkey(items: number[]) {
    this.timesInspected = 0;
    this.items = items;
  }
}

async function day11(): Promise<void> {
  const inputFile = fs.createReadStream('./day11/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  // We only have to track how many times did a monkey inspect an item.
  // There is no need to keep track of these "ridiculous" worry levels (even BigInt would be not enough for this).
  // The only time these values are needed is during the testing part - with the tests being divisibility.
  // Using the fact that  k*n+q % n = q % n , each item can be safely made a modulo of the product of all the divisors without affecting the result.
  let totalModuloProduct = 1;
  let currentMonkey = new Monkey();
  const monkeys: Monkey[] = [];
  for await (const inputLine of inputLines) {
    if (inputLine.trim().startsWith('Monkey')) {
      currentMonkey = new Monkey();
      monkeys.push(currentMonkey);
    } else if (inputLine.trim().startsWith('Starting items:')) {
      currentMonkey.items = inputLine
        .split(':')[1]
        .split(',')
        .map((i) => parseInt(i));
    } else if (inputLine.trim().startsWith('Operation:')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentMonkey.operation = (old: number) => eval(inputLine.split('=')[1]);
    } else if (inputLine.trim().startsWith('Test:')) {
      totalModuloProduct *= parseInt(inputLine.split('divisible by')[1]);
      currentMonkey.test = (worryLevel: number) =>
        worryLevel % parseInt(inputLine.split('divisible by')[1]) === 0;
    } else if (inputLine.trim().startsWith('If true')) {
      currentMonkey.ifTrue = parseInt(inputLine.split('to monkey')[1]);
    } else if (inputLine.trim().startsWith('If false')) {
      currentMonkey.ifFalse = parseInt(inputLine.split('to monkey')[1]);
    }
  }

  // backing up the items
  const itemsCopy: number[][] = [];
  for (let i = 0; i < monkeys.length; i++) {
    itemsCopy.push(monkeys[i].backupItems());
  }

  // Simulating 20 rounds with worry level going down
  for (let i = 0; i < 20; i++) {
    for (const monkey of monkeys) {
      const threwItems = monkey.makeTurn();
      threwItems.forEach((i) => monkeys[i.throwTo].items.push(i.item));
    }
  }
  const inspections1 = monkeys
    .map((m) => m.timesInspected)
    .sort((a, b) => b - a);

  // restoring the items copy
  for (let i = 0; i < monkeys.length; i++) {
    monkeys[i].resetMonkey(itemsCopy[i]);
  }

  // Simulating 10000 rounds without worry level going down
  for (let i = 0; i < 10000; i++) {
    for (const monkey of monkeys) {
      const threwItems = monkey.makeTurn(false);
      threwItems.forEach((i) => {
        i.item %= totalModuloProduct;
        monkeys[i.throwTo].items.push(i.item);
      });
    }
  }
  const inspections2 = monkeys
    .map((m) => m.timesInspected)
    .sort((a, b) => b - a);

  console.log(
    `Monkey business for 20 rounds is equal to ${
      inspections1[0] * inspections1[1]
    }`,
  );
  console.log(
    `Monkey business for 10000 rounds is equal to ${
      inspections2[0] * inspections2[1]
    }`,
  );
}

day11();
