const fs = require('fs');
const esprima = require('esprima');

const code = fs.readFileSync('../api/src/index.ts', 'utf8');

const ast = esprima.parseScript(code, { sourceType: 'module' });

let functionCount = 0;
let importCount = 0;

function traverseAST(node) {
  if (node.type === 'FunctionDeclaration' || node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') {
    functionCount++;
  } else if (node.type === 'ImportDeclaration') {
    importCount++;
  }

  for (let key in node) {
    if (node.hasOwnProperty(key) && typeof node[key] === 'object' && node[key] !== null) {
      traverseAST(node[key]);
    }
  }
}

traverseAST(ast);

console.log(`Number of functions: ${functionCount}`);
console.log(`Number of import statements: ${importCount}`);

