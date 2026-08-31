import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

function runNormalizeDist() {
  execSync('node ../../scripts/normalize-compass-ui-dist.mjs', {
    cwd: packageRoot,
    stdio: 'inherit',
  });
}

/**
 * Vite writes preserveModules output as PascalCase (source folder names).
 * Re-run kebab-case normalization after every build, including --watch.
 *
 * closeBundle does not fire per watch rebuild. dts writeBundle is async and
 * can finish after the CJS output, so wait for both lib outputs and dts.
 */
const LIB_OUTPUT_COUNT = 2;

let completedOutputs = 0;
let dtsFinished = false;
let normalized = false;

function flushNormalize() {
  if (normalized || !dtsFinished || completedOutputs < LIB_OUTPUT_COUNT) return;
  normalized = true;
  runNormalizeDist();
}

export function markCompassUiDtsFinished() {
  dtsFinished = true;
  flushNormalize();
}

export function compassUiNormalizeDist(): Plugin {
  return {
    name: 'compass-ui-normalize-dist',
    apply: 'build',
    enforce: 'post',
    buildStart() {
      completedOutputs = 0;
      dtsFinished = false;
      normalized = false;
    },
    writeBundle() {
      completedOutputs += 1;
      flushNormalize();
    },
  };
}
