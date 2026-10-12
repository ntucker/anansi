import { execFileSync } from 'node:child_process';

// Tests run the built generator; build once here so parallel workers
// never race each other writing into generators/.
export default function globalSetup() {
  // yarn sets npm_execpath to its own absolute path, so yarn isn't looked up on PATH
  const yarn = process.env.npm_execpath;
  if (!yarn) throw new Error('Run these tests through yarn (yarn run test)');
  execFileSync(yarn, ['run', 'build'], {
    cwd: import.meta.dirname,
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'inherit',
  });
}
