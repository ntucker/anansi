// Point ./package.json's resolutions at every tarball in $PACK_DIR.
// --add-dev also lists each as a devDependency, so it gets installed.
import fs from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

// Parses package/package.json out of a yarn pack tarball. Each ustar entry is
// a 512-byte header (name at 0-100, octal size at 124-136), then its data
// padded to 512 bytes; an empty name marks the end of the archive.
function readManifest(tgz) {
  const tar = gunzipSync(fs.readFileSync(tgz));
  for (let offset = 0; offset + 512 <= tar.length;) {
    const name = tar
      .toString('utf8', offset, offset + 100)
      .replace(/\0.*/s, '');
    const size = Number.parseInt(
      tar.toString('utf8', offset + 124, offset + 136),
      8,
    );
    if (!name || !(size >= 0)) break;
    offset += 512;
    if (name === 'package/package.json') {
      return JSON.parse(tar.toString('utf8', offset, offset + size));
    }
    offset += Math.ceil(size / 512) * 512;
  }
  throw new Error(`${tgz} has no package/package.json`);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const addDev = process.argv.includes('--add-dev');
pkg.resolutions ??= {};
if (addDev) pkg.devDependencies ??= {};
for (const file of fs.readdirSync(process.env.PACK_DIR)) {
  const tgz = path.join(process.env.PACK_DIR, file);
  const { name } = readManifest(tgz);
  pkg.resolutions[name] = `file:${tgz}`;
  if (addDev) pkg.devDependencies[name] ??= '*';
  console.log(`${name} -> ${tgz}`);
}
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
