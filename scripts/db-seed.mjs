import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function run(command) {
  execSync(command, { stdio: 'inherit', cwd: rootDir });
}

const dbName = execSync('node scripts/get-db-name.mjs', { cwd: rootDir })
  .toString()
  .trim();

const sqlFile = path.join('src', 'db', 'seed.sql');

run(`wrangler d1 execute ${dbName} --local --file ${sqlFile}`);
