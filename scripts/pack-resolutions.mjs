// Point ./package.json's resolutions at every tarball in $PACK_DIR.
// --add-dev also lists each as a devDependency, so it gets installed.
import fs from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

// a tarball's package/package.json, read in-process rather than spawning tar
function readManifest(tgz) {
  const tar = gunzipSync(fs.readFileSync(tgz));
  for (let offset = 0; offset < tar.length;) {
    const name = tar
      .toString('utf8', offset, offset + 100)
      .replace(/\0.*/s, '');
    const size = parseInt(tar.toString('utf8', offset + 124, offset + 136), 8);
    offset += 512;
    if (name === 'package/package.json') {
      return JSON.parse(tar.toString('utf8', offset, offset + size));
    }
    offset += Math.ceil(size / 512) * 512;
  }
  throw new Error(`${tgz} has no package/package.json`);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.resolutions ??= {};
for (const file of fs.readdirSync(process.env.PACK_DIR)) {
  const tgz = path.join(process.env.PACK_DIR, file);
  const { name } = readManifest(tgz);
  pkg.resolutions[name] = `file:${tgz}`;
  if (process.argv.includes('--add-dev')) pkg.devDependencies[name] ??= '*';
  console.log(`${name} -> ${tgz}`);
}
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
