import * as fs from 'fs';
import * as readline from 'readline';

type Packet = Array<number | Packet>;

function comparePackets(
  packet1: Packet | number,
  packet2: Packet | number,
): -1 | 0 | 1 {
  if (typeof packet1 === 'number' && typeof packet2 === 'number') {
    return Math.sign(packet2 - packet1) as -1 | 0 | 1;
  }

  const packet1Parsed = typeof packet1 === 'number' ? [packet1] : packet1;
  const packet2Parsed = typeof packet2 === 'number' ? [packet2] : packet2;

  for (let i = 0; i < packet2Parsed.length; i++) {
    if (packet1Parsed[i] === undefined) return 1;
    const comp = comparePackets(packet1Parsed[i], packet2Parsed[i]);
    if (comp !== 0) return comp;
  }
  if (packet1Parsed.length > packet2Parsed.length) return -1;
  return 0;
}

async function day13(): Promise<void> {
  const inputFile = fs.createReadStream('./day13/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  let packet1: Packet | null = null;
  let correctOrder = 0;
  let index = 1;

  const dividerPacket1: Packet = [[2]];
  const dividerPacket2: Packet = [[6]];
  const allPackets: Packet[] = [dividerPacket1, dividerPacket2];
  for await (const inputLine of inputLines) {
    if (inputLine === '') continue;
    const packet = JSON.parse(inputLine) as Packet;
    allPackets.push(packet);
    if (packet1 === null) {
      packet1 = packet;
    } else {
      if (comparePackets(packet1, packet) === 1) correctOrder += index;
      packet1 = null;
      index++;
    }
  }

  allPackets.sort(comparePackets).reverse();

  const decoderKey =
    (allPackets.indexOf(dividerPacket1) + 1) *
    (allPackets.indexOf(dividerPacket2) + 1);
  console.log(`Pairs of packets in the correct order: ${correctOrder}`);
  console.log(`Decoder key is equal to: ${decoderKey}`);
}

day13();
