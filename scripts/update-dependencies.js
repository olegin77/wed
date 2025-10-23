#!/usr/bin/env node

/**
 * Dependency update script
 * Safely updates dependencies with compatibility checks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Starting dependency update process...\n');

// 1. Check current dependency status
console.log('📊 Checking current dependency status...');
try {
  execSync('pnpm outdated', { stdio: 'pipe' });
  console.log('✅ All dependencies are up to date');
} catch (error) {
  console.log('📦 Found outdated dependencies');
  console.log(error.stdout?.toString() || '');
}

// 2. Update TypeScript and related packages
console.log('\n🔧 Updating TypeScript and core packages...');
const corePackages = [
  'typescript@latest',
  '@types/node@latest',
  '@types/react@latest',
  '@types/react-dom@latest',
  'eslint@latest',
  '@eslint/js@latest',
  '@eslint/eslintrc@latest',
];

corePackages.forEach(pkg => {
  try {
    console.log(`Updating ${pkg}...`);
    execSync(`pnpm add -D ${pkg}`, { stdio: 'pipe' });
    console.log(`✅ ${pkg} updated successfully`);
  } catch (error) {
    console.log(`❌ Failed to update ${pkg}: ${error.message}`);
  }
});

// 3. Update Prisma
console.log('\n🗄️ Updating Prisma...');
try {
  execSync('pnpm add -D @prisma/client@latest prisma@latest', { stdio: 'pipe' });
  console.log('✅ Prisma updated successfully');
} catch (error) {
  console.log(`❌ Failed to update Prisma: ${error.message}`);
}

// 4. Update security packages
console.log('\n🔒 Updating security packages...');
const securityPackages = [
  'eslint-plugin-security@latest',
  'semgrep@latest',
];

securityPackages.forEach(pkg => {
  try {
    console.log(`Updating ${pkg}...`);
    execSync(`pnpm add -D ${pkg}`, { stdio: 'pipe' });
    console.log(`✅ ${pkg} updated successfully`);
  } catch (error) {
    console.log(`❌ Failed to update ${pkg}: ${error.message}`);
  }
});

// 5. Update utility packages
console.log('\n🛠️ Updating utility packages...');
const utilityPackages = [
  'tsx@latest',
];

utilityPackages.forEach(pkg => {
  try {
    console.log(`Updating ${pkg}...`);
    execSync(`pnpm add -D ${pkg}`, { stdio: 'pipe' });
    console.log(`✅ ${pkg} updated successfully`);
  } catch (error) {
    console.log(`❌ Failed to update ${pkg}: ${error.message}`);
  }
});

// 6. Run security audit
console.log('\n🔍 Running security audit...');
try {
  execSync('pnpm audit', { stdio: 'pipe' });
  console.log('✅ No security vulnerabilities found');
} catch (error) {
  console.log('⚠️ Security vulnerabilities found');
  console.log('Run "pnpm audit --fix" to fix automatically');
}

// 7. Update lockfile
console.log('\n🔒 Updating lockfile...');
try {
  execSync('pnpm install', { stdio: 'pipe' });
  console.log('✅ Lockfile updated successfully');
} catch (error) {
  console.log(`❌ Failed to update lockfile: ${error.message}`);
}

// 8. Run tests to ensure compatibility
console.log('\n🧪 Running tests to ensure compatibility...');
try {
  execSync('pnpm run test', { stdio: 'pipe' });
  console.log('✅ All tests passed');
} catch (error) {
  console.log('❌ Some tests failed after update');
  console.log('Please review and fix failing tests');
}

// 9. Generate update report
const updateReport = {
  timestamp: new Date().toISOString(),
  updatedPackages: corePackages.concat(securityPackages, utilityPackages),
  status: 'completed',
  recommendations: [
    'Run "pnpm run lint" to check for any linting issues',
    'Run "pnpm run build" to ensure everything builds correctly',
    'Run "pnpm run test" to verify all tests pass',
    'Review any breaking changes in updated packages',
    'Update your code if necessary to match new package APIs'
  ]
};

fs.writeFileSync('dependency-update-report.json', JSON.stringify(updateReport, null, 2));
console.log('\n📊 Update report saved to dependency-update-report.json');

console.log('\n✅ Dependency update process completed!');
console.log('\n📋 Next steps:');
console.log('1. Review the update report');
console.log('2. Run "pnpm run lint" to check for issues');
console.log('3. Run "pnpm run build" to ensure everything builds');
console.log('4. Run "pnpm run test" to verify tests pass');
console.log('5. Update your code if needed for breaking changes');