'use strict';

const importsRe = new RegExp(
  /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/,
  'mg',
);

module.exports = {
  stripImports(src) {
    const imports = [];

    const matches = src.match(importsRe);
    if (matches) {
      matches.map(match => {
        imports.push(match);
      });
    }

    return {
      code: src.replace(importsRe, ''),
      imports,
    };
  },
};
