// Point ./package.json's resolutions at every tarball in $PACK_DIR.
// --add-dev also lists each as a devDependency, so it gets installed.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.resolutions ??= {};
for (const file of fs.readdirSync(process.env.PACK_DIR)) {
  const tgz = path.join(process.env.PACK_DIR, file);
  const { name } = JSON.parse(
    execFileSync('tar', ['-xOzf', tgz, 'package/package.json']),
  );
  pkg.resolutions[name] = `file:${tgz}`;
  if (process.argv.includes('--add-dev')) pkg.devDependencies[name] ??= '*';
  console.log(`${name} -> ${tgz}`);
}
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
