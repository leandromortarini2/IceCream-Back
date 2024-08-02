import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const checkTypesForPackage = async (pkg: string): Promise<{ pkg: string; hasTypes: boolean }> => {
  try {
    await execAsync(`npm view @types/${pkg} name`);
    return { pkg, hasTypes: true };
  } catch {
    return { pkg, hasTypes: false };
  }
};

const checkAllTypes = async () => {
  const packageJsonPath = path.resolve(__dirname, 'package.json');
  const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {})
  ];

  const results = await Promise.all(dependencies.map(checkTypesForPackage));

  const packagesWithTypes = results.filter(result => result.hasTypes);
  const packagesWithoutTypes = results.filter(result => !result.hasTypes);

  console.log('\nPackages with @types:');
  packagesWithTypes.forEach(result => console.log(`- ${result.pkg}`));

  console.log('\nPackages without @types:');
  packagesWithoutTypes.forEach(result => console.log(`- ${result.pkg}`));
};

checkAllTypes();
