import * as fsSync from 'fs';
import * as fs from 'fs/promises';

async function createOrRunDayProject(): Promise<void> {
  if (isNaN(process.argv[2] as any)) {
    console.error('Error: Please specify the day number!');
    return;
  }

  const day = parseInt(process.argv[2]);

  try {
    await fs.access(`day${day}/day${day}.ts`, 0);

    console.log(`> Executing day ${day}...\n`);
    require(`./day${day}/day${day}.ts`);
    return;
  } catch (err: any) {
    if (err?.code !== 'ENOENT') {
      console.error('Error: Cannot access the file!');
      return;
    }
  }

  console.log(`> Creating files for day ${day}...`);

  const content = `async function day${day}(): Promise<void> {\n\n}\n\nday${day}();`;

  try {
    if (!fsSync.existsSync(`day${day}`)) {
      await fs.mkdir(`day${day}`);
    }
    await fs.writeFile(`day${day}/day${day}.ts`, content);
  } catch (err) {
    console.error('Error: There was an error when creating the files!');
    console.error(err);
  }
  console.log(`> Files for day ${day} successfully created!\n`);
}

createOrRunDayProject();
