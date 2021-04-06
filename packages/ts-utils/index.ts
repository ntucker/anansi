import * as ts from 'typescript';

export function readTsConfig(path = './', configName = 'tsconfig.json') {
  const parseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    useCaseSensitiveFileNames: true,
  };

  const configFileName = ts.findConfigFile(path, ts.sys.fileExists, configName);
  if (!configFileName)
    throw new Error(
      `File not found at path ${path}. Configname: ${configFileName}`,
    );
  const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
  const compilerOptions = ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    path,
  );
  return compilerOptions;
}
