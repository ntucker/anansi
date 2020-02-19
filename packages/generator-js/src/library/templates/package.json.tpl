{
  "sideEffects": false,
  "main": "<%= assetPath %>/index.cjs.js",
  "module": "<%= libPath %>/index.js",
  "unpkg": "<%= assetPath %>/index.umd.min.js",
  "types": "<%= libPath %>/index.d.ts",
  "scripts": {
    "build:lib": "cross-env NODE_ENV=production babel <%= rootPath %> --out-dir <%= libPath %> --source-maps inline --extensions '.ts,.tsx,.js' --ignore '**/__tests__/**' --ignore '**/*.d.ts'",
    "build:types": "ttsc --build",
    "build:clean": "rimraf <%= libPath %> <%= assetPath %> *.tsbuildinfo",
    "build": "yarn run build:lib && yarn run build:types",
    "dev": "yarn run build:lib -w",
    "prepare": "yarn run build"
  }
}
