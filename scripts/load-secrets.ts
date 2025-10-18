#!/usr/bin/env tsx
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ENV_FILE = '.env';
const WRANGLER_NAME = 'warewise-app'; // From wrangler.jsonc

function loadSecretsFromEnv() {
  try {
    const envPath = join(process.cwd(), ENV_FILE);
    const envContent = readFileSync(envPath, 'utf-8');

    const secrets: Record<string, string> = {};

    for (const line of envContent.split('\n')) {
      const trimmedLine = line.trim();

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex === -1) {
        continue;
      }

      const key = trimmedLine.substring(0, equalIndex).trim();
      let value = trimmedLine.substring(equalIndex + 1).trim();

      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      secrets[key] = value;
    }

    return secrets;
  } catch (error) {
    console.error(`Error reading ${ENV_FILE}:`, error);
    process.exit(1);
  }
}

function setWranglerSecret(name: string, value: string) {
  try {
    console.log(`Setting secret: ${name}`);
    execSync(
      `echo "${value}" | wrangler secret put ${name} --name ${WRANGLER_NAME}`,
      {
        stdio: ['pipe', 'inherit', 'inherit'],
        encoding: 'utf-8',
      }
    );
    console.log(`✓ Secret ${name} set successfully`);
  } catch (error) {
    console.error(`✗ Failed to set secret ${name}:`, error);
    throw error;
  }
}

function main() {
  console.log(`Loading secrets from ${ENV_FILE} to Wrangler...`);

  const secrets = loadSecretsFromEnv();
  const secretKeys = Object.keys(secrets);

  if (secretKeys.length === 0) {
    console.log('No secrets found in .env file');
    return;
  }

  console.log(`Found ${secretKeys.length} secrets to upload:`);
  for (const key of secretKeys) {
    console.log(`  - ${key}`);
  }
  console.log('');

  let successCount = 0;
  let failureCount = 0;

  for (const [name, value] of Object.entries(secrets)) {
    try {
      setWranglerSecret(name, value);
      successCount++;
    } catch (error) {
      failureCount++;
      console.error(`Failed to set ${name}:`, error);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`✓ Successful: ${successCount}`);
  console.log(`✗ Failed: ${failureCount}`);

  if (failureCount > 0) {
    process.exit(1);
  }
}

// Run main function if this file is executed directly
main();
