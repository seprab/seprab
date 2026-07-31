// Generates dist/sergio-prada-cv.pdf by printing the built /cv-print/ page
// with headless Chromium. Runs after `astro build` (see `npm run build:full`
// and .github/workflows/deploy.yml), so the PDF always matches cv.yaml.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = 4321;
const URL = `http://localhost:${PORT}/cv-print/`;
const OUT = 'dist/sergio-prada-cv.pdf';

async function waitForServer(url, attempts = 30) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server not up yet
    }
    await sleep(500);
  }
  throw new Error(`Preview server did not respond at ${url}`);
}

// `astro preview` serves the already-built dist/ folder.
const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
  stdio: 'inherit',
});

let exitCode = 0;
try {
  await waitForServer(URL);

  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.pdf({
      path: OUT,
      format: 'A4',
      printBackground: true,
      margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
    });
    console.log(`PDF written to ${OUT}`);
  } finally {
    await browser.close();
  }
} catch (err) {
  console.error(err);
  exitCode = 1; // fail the CI build visibly
} finally {
  preview.kill('SIGTERM');
}
process.exit(exitCode);
