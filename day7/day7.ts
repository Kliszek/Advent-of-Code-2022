import * as fs from 'fs';
import * as readline from 'readline';

const DISK_SIZE = 70000000;
const UPDATE_SIZE = 30000000;

class File {
  parent: Directory;
  size: number;
  name: string;

  constructor(parent: Directory, size: number, name: string) {
    this.parent = parent;
    this.size = size;
    this.name = name;
  }
}

class MainDirectory {
  parent: Directory | null;
  name: string;
  files: File[];
  directories: Directory[];
  currentSize: number;

  constructor(parent?: Directory, name?: string) {
    this.parent = parent ?? null;
    this.name = name ?? '/';
    this.files = [];
    this.directories = [];
    this.currentSize = 0;
  }

  // calculateSize(): number {
  //   let size = 0;
  //   this.files.forEach((f) => (size += f.size));
  //   this.directories.forEach((d) => (size += d.calculateSize()));
  //   return size;
  // }

  changeDir(dirName: string): Directory {
    let newDir: Directory | null;

    if (dirName === '..') newDir = this.parent;
    else newDir = this.directories.find((d) => d.name === dirName) ?? null;

    if (!newDir) {
      throw new Error(
        `Directory ${dirName} does not exist in directory ${this.name}!`,
      );
    }
    return newDir;
  }

  getOrCreateDirectory(
    name: string,
    directoryRegistry?: Directory[],
  ): Directory {
    const existing = this.directories.find((d) => d.name === name);
    if (!existing) {
      const newDir = new Directory(this, name);
      this.directories.push(newDir);
      if (directoryRegistry) {
        directoryRegistry.push(newDir);
      }
      return newDir;
    } else {
      return existing;
    }
  }

  getOrCreateFile(size: number, name: string): File {
    const existing = this.files.find((f) => f.name === name);
    if (!existing) {
      const newFile = new File(this, size, name);
      this.files.push(newFile);
      this.updateCurrentSize(size);
      return newFile;
    } else {
      return existing;
    }
  }

  updateCurrentSize(value: number): void {
    this.currentSize += value;
    if (this.parent) {
      this.parent.updateCurrentSize(value);
    }
  }
}

class Directory extends MainDirectory {
  constructor(parent: Directory, name: string) {
    super(parent, name);
  }
}

async function day7(): Promise<void> {
  const inputFile = fs.createReadStream('./day7/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  const mainDirectory = new MainDirectory();
  const allDirectories: Directory[] = [mainDirectory];
  let currentDir: Directory = mainDirectory;

  for await (const inputLine of inputLines) {
    if (inputLine === '$ ls') {
      continue;
    }
    if (inputLine === '$ cd /') {
      currentDir = mainDirectory;
      continue;
    }
    if (inputLine.startsWith('$ cd ')) {
      const changeDir = inputLine.slice(5);
      currentDir = currentDir.changeDir(changeDir);
      continue;
    }
    const [x, name] = inputLine.split(' ');
    if (x === 'dir') {
      currentDir.getOrCreateDirectory(name, allDirectories);
    } else {
      currentDir.getOrCreateFile(parseInt(x), name);
    }
  }

  let sum = 0;
  allDirectories.forEach((d) => {
    if (d.currentSize <= 100000) {
      sum += d.currentSize;
    }
  });

  const neededSpace = UPDATE_SIZE - (DISK_SIZE - mainDirectory.currentSize);
  let smallestSize = DISK_SIZE;
  allDirectories.forEach((d) => {
    if (d.currentSize >= neededSpace && d.currentSize < smallestSize) {
      smallestSize = d.currentSize;
    }
  });

  console.log(
    `The joined size of directories lighter than 1,000,000 equals ${sum}`,
  );
  console.log(
    `The size of the smallest directory that would free enough space when removed is equals ${smallestSize}`,
  );
}

day7();
