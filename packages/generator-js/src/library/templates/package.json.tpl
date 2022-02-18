{
  "sideEffects": false,
  "main": "<%= assetPath %>/index.cjs.js",
  "module": "<%= libPath %>/index.js",
  "unpkg": "<%= assetPath %>/index.umd.min.js",
  "types": "<%= libPath %>/index.d.ts",
  "files": [
    "<%= rootPath %>",
    "<%= assetPath %>",
    "<%= libPath %>",
    "LICENSE",
    "README.md"
  ],
  "scripts": {
    "build:lib": "NODE_ENV=production babel <%= rootPath %> --out-dir <%= libPath %> --source-maps inline --extensions '.ts,.tsx,.js' --ignore '**/__tests__/**' --ignore '**/*.d.ts'",
    "build:types": "ttsc --build",
    "build:clean": "rimraf <%= libPath %> <%= assetPath %> *.tsbuildinfo",
    "build": "npm run build:lib && npm run build:types",
    "dev": "npm run build:lib -w",
    "prepack": "npm run build"
  }
}
