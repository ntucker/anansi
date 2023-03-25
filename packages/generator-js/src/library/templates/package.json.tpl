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
    "build:types": "tsc --build",
    "build:clean": "rimraf <%= libPath %> <%= assetPath %> *.tsbuildinfo",
    "build": "run build:lib && run build:types",
    "dev": "run build:lib -w",
    "prepack": "run build"
  }
}
