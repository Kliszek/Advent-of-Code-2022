import * as fs from 'fs';
import * as readline from 'readline';

type Graph = Array<Record<number, number>>;

function heightDiff(h1: string, h2: string): number {
  h1 = h1 === 'S' ? 'a' : h1 === 'E' ? 'z' : h1;
  h2 = h2 === 'S' ? 'a' : h2 === 'E' ? 'z' : h2;
  return h1.charCodeAt(0) - h2.charCodeAt(0);
}

function shortestDistanceVertex(
  notVisited: Array<number>,
  distances: Array<number>,
): number {
  let shortest = Infinity;
  for (const v of notVisited) {
    if (shortest === Infinity || distances[v] < distances[shortest])
      shortest = v;
  }
  return shortest;
}

// Dijkstra's algorithm
function findShortestPath(graph: Graph, source: number, target?: number) {
  const notVisited = Array.from(Array(graph.length).keys());
  const distances = new Array(graph.length).fill(Infinity);
  const prev = new Array(graph.length).fill(undefined);

  distances[source] = 0;

  while (notVisited.length > 0) {
    const u = shortestDistanceVertex(notVisited, distances);
    if (u === Infinity) break;
    if (target && u === target) break;
    notVisited.splice(notVisited.indexOf(u), 1);

    for (const [vString, weight] of Object.entries(graph[u])) {
      const v = parseInt(vString);
      if (notVisited.includes(v)) {
        const alt = distances[u] + weight;
        if (alt < distances[v]) {
          distances[v] = alt;
          prev[v] = u;
        }
      }
    }
  }

  return distances;
}

async function day12(): Promise<void> {
  const inputFile = fs.createReadStream('./day12/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  const hMap: Array<Array<string>> = [];
  for await (const inputLine of inputLines) {
    hMap.push(inputLine.split(''));
  }
  const width = hMap[0].length;
  const height = hMap.length;

  const graph1: Graph = [];
  const graph2: Graph = [];

  let start = -1;
  let end = -1;
  const lowestElevation: Array<number> = [];
  const getVertexNumber = (x: number, y: number) => y * hMap[0].length + x;
  for (let i = 0; i < hMap.length; i++) {
    for (let j = 0; j < hMap[0].length; j++) {
      const v = getVertexNumber(j, i);
      graph1[v] = {};
      if (hMap[i][j] === 'a') lowestElevation.push(v);
      else if (hMap[i][j] === 'E') end = v;
      else if (hMap[i][j] === 'S') {
        start = v;
        lowestElevation.push(v);
      }
      if (i > 0 && heightDiff(hMap[i - 1][j], hMap[i][j]) <= 1)
        graph1[v][getVertexNumber(j, i - 1)] = 1;
      if (i < height - 1 && heightDiff(hMap[i + 1][j], hMap[i][j]) <= 1)
        graph1[v][getVertexNumber(j, i + 1)] = 1;
      if (j > 0 && heightDiff(hMap[i][j - 1], hMap[i][j]) <= 1)
        graph1[v][getVertexNumber(j - 1, i)] = 1;
      if (j < width - 1 && heightDiff(hMap[i][j + 1], hMap[i][j]) <= 1)
        graph1[v][getVertexNumber(j + 1, i)] = 1;
    }
  }

  // Create a reverse of graph1
  for (let i = 0; i < graph1.length; i++) {
    graph2[i] ??= {};
    for (const [neighborString, weight] of Object.entries(graph1[i])) {
      const neighbor = parseInt(neighborString);
      graph2[neighbor] ??= {};
      graph2[neighbor][i] = weight;
    }
  }

  const distances1 = findShortestPath(graph1, start, end);
  const distances2 = findShortestPath(graph2, end);
  let minPath = Infinity;
  for (const l of lowestElevation) {
    if (distances2[l] < minPath) minPath = distances2[l];
  }
  console.log(`The shortest path from S to E is equal ${distances1[end]}`);
  console.log(`The shortest path from any lowest height to E is ${minPath}`);
}

day12();
