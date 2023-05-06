const fs = require('fs');
const ts = require('typescript');
const globModule = require('glob');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Please provide a directory path as a command line argument.');
  process.exit(1);
}

const inputDirectoryPath = process.argv[2];
const directoryPath = path.resolve(inputDirectoryPath);

function countFunctionsAndImports(sourceFile) {
  let functionCount = 0;
  let importCount = 0;

  function visit(node) {
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
      functionCount++;
    } else if (ts.isImportDeclaration(node)) {
      importCount++;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return { functionCount, importCount };
}

(async () => {
  try {
    const files = await globModule.glob(directoryPath + '/**/*.ts', { ignore: '**/*.spec.*' });

    let totalFunctionCount = 0;
    let totalImportCount = 0;

    files.forEach((file) => {
      const code = fs.readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true);

      const { functionCount, importCount } = countFunctionsAndImports(sourceFile);

      console.log(`File: ${file}`);
      console.log(`  Number of functions: ${functionCount}`);
      console.log(`  Number of import statements: ${importCount}`);

      totalFunctionCount += functionCount;
      totalImportCount += importCount;
    });

    console.log(`Files: ${files.length}\n`);
    console.log(`\nTotal number of functions: ${totalFunctionCount}`);
    console.log(`Total number of import statements: ${totalImportCount}`);
  } catch (err) {
    console.error('Error while searching for files:', err);
  }
})();

