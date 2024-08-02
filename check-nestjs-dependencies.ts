import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const checkNestjsPackage = async (pkg: string): Promise<{ pkg: string; exists: boolean }> => {
  try {
    const { stdout } = await execAsync(`npm search @nestjs/${pkg} --json`);
    const results = JSON.parse(stdout);
    const exists = results.some((result: { name: string }) => result.name === `@nestjs/${pkg}`);
    return { pkg, exists };
  } catch {
    return { pkg, exists: false };
  }
};

const checkAllNestjsPackages = async () => {
  const packageJsonPath = path.resolve(__dirname, 'package.json');
  const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {})
  ];

  const results = await Promise.all(dependencies.map(checkNestjsPackage));

  const packagesWithNestjs = results.filter(result => result.exists);
  const packagesWithoutNestjs = results.filter(result => !result.exists);

  console.log('\nPackages with @nestjs equivalents:');
  packagesWithNestjs.forEach(result => console.log(`- ${result.pkg}`));

  console.log('\nPackages without @nestjs equivalents:');
  packagesWithoutNestjs.forEach(result => console.log(`- ${result.pkg}`));
};

checkAllNestjsPackages();
