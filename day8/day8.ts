import * as fs from 'fs';
import * as readline from 'readline';

type TreeMap = Array<Array<Tree>>;

class Tree {
  height: number;

  neighboringTrees: {
    up: Tree | null;
    right: Tree | null;
    down: Tree | null;
    left: Tree | null;
  };

  // heights of the tallest trees in every direction from this tree
  tallestTrees: {
    up?: number;
    right?: number;
    down?: number;
    left?: number;
  };

  visibleTrees: {
    up?: { count: number; lastVisible: Tree | null };
    right?: { count: number; lastVisible: Tree | null };
    down?: { count: number; lastVisible: Tree | null };
    left?: { count: number; lastVisible: Tree | null };
  };

  constructor(
    height: number,
    treeUp: Tree | null,
    treeRight: Tree | null,
    treeDown: Tree | null,
    treeLeft: Tree | null,
  ) {
    this.height = height;
    this.neighboringTrees = {
      up: treeUp,
      right: treeRight,
      down: treeDown,
      left: treeLeft,
    };
    if (treeUp) treeUp.neighboringTrees.down = this;
    if (treeRight) treeRight.neighboringTrees.left = this;
    if (treeDown) treeDown.neighboringTrees.up = this;
    if (treeLeft) treeLeft.neighboringTrees.right = this;
    this.tallestTrees = {};
    this.visibleTrees = {};
  }

  calculateSurroundings(direction: 'up' | 'right' | 'down' | 'left'): number {
    if (!this.tallestTrees[direction]) {
      this.tallestTrees[direction] = !this.neighboringTrees[direction]
        ? -1
        : Math.max(
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            this.neighboringTrees[direction]!.calculateSurroundings(direction),
            this.neighboringTrees[direction]!.height,
            /* eslint-enable @typescript-eslint/no-non-null-assertion */
          );
    }
    return this.tallestTrees[direction] as number;
  }

  isVisible(): boolean {
    const minHeight = Math.min(
      this.calculateSurroundings('up'),
      this.calculateSurroundings('right'),
      this.calculateSurroundings('down'),
      this.calculateSurroundings('left'),
    );
    return this.height > minHeight;
  }

  calculateVisibleTrees(direction: 'up' | 'right' | 'down' | 'left'): number {
    let visibleTrees = 0;
    let currentTree = this.neighboringTrees[direction];

    if (currentTree) visibleTrees++;
    while (currentTree) {
      if (currentTree.height >= this.height) break;

      if (!currentTree.visibleTrees[direction]) {
        currentTree.calculateVisibleTrees(direction);
      }

      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      visibleTrees += currentTree.visibleTrees[direction]!.count;
      currentTree = currentTree.visibleTrees[direction]!.lastVisible;
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
    }

    this.visibleTrees[direction] = {
      count: visibleTrees,
      lastVisible: currentTree,
    };

    return visibleTrees;
  }

  calculateTreeScore(): number {
    return (
      this.calculateVisibleTrees('up') *
      this.calculateVisibleTrees('right') *
      this.calculateVisibleTrees('down') *
      this.calculateVisibleTrees('left')
    );
  }
}

async function day8(): Promise<void> {
  const inputFile = fs.createReadStream('./day8/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  const treeMap: TreeMap = [];

  // saving the input into an array
  const treeHeightMap: Array<Array<number>> = [];
  for await (const inputLine of inputLines) {
    const treeRow: Array<number> = [];

    for (const treeHeight of inputLine) {
      treeRow.push(parseInt(treeHeight));
    }
    treeHeightMap.push(treeRow);
  }
  const y = treeHeightMap.length;
  const x = treeHeightMap[0].length;

  // transforming the input into an array of objects
  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      treeMap[i] ??= [];
      treeMap[i][j] = new Tree(
        treeHeightMap[i][j],
        treeMap[i - 1]?.[j] ?? null,
        treeMap[i]?.[j + 1] ?? null,
        treeMap[i + 1]?.[j] ?? null,
        treeMap[i]?.[j - 1] ?? null,
      );
    }
  }

  let visibleTrees = 0;
  let maxTreeScore = 0;
  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      if (treeMap[i][j].isVisible()) visibleTrees++;
      maxTreeScore = Math.max(maxTreeScore, treeMap[i][j].calculateTreeScore());
    }
  }

  console.log(`Trees that are visible from the outside: ${visibleTrees}`);
  console.log(`Maximal tree score is: ${maxTreeScore}`);
}

day8();
