import { execFileSync } from 'node:child_process';

// Tests run the built generator; build once here so parallel workers
// never race each other writing into generators/.
export default function globalSetup() {
  execFileSync('yarn', ['run', 'build'], {
    cwd: import.meta.dirname,
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'inherit',
  });
}
