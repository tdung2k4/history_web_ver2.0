const fs = require('fs');
const path = require('path');

async function main() {
  const url = process.env.GEMINI_API_URL;
  const key = process.env.GEMINI_API_KEY;
  const cmd = process.argv[2] || 'advice';

  if (!url || !key) {
    console.error('Missing GEMINI_API_URL or GEMINI_API_KEY environment variables.');
    console.error('Set them before running, for example:');
    console.error('  export GEMINI_API_URL="https://your-gemini-endpoint.example/v1/generate"');
    console.error('  export GEMINI_API_KEY="<your_key_here>"');
    process.exit(1);
  }

  const repoRoot = path.resolve(__dirname, '..');
  const claudePath = path.join(repoRoot, 'CLAUDE.md');
  let claude = '';
  try { claude = fs.readFileSync(claudePath, 'utf8'); } catch (e) { /* ignore */ }
  const summary = claude.split('\n').slice(0, 30).filter(Boolean).join(' ').slice(0, 800);

  let prompt = '';
  if (cmd === 'advice') {
    prompt = `You are a Project Manager assistant. Given the repository summary below, return a short, prioritized list of 5 actionable steps the team should take next (very concise). Repository summary:\n${summary}`;
  } else {
    prompt = process.argv.slice(2).join(' ');
  }

  console.log('Sending prompt to Gemini endpoint...');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({ input: prompt })
    });

    const contentType = res.headers.get('content-type') || '';
    let bodyText;
    if (contentType.includes('application/json')) {
      const json = await res.json();
      // Try print a few likely places where model output can live
      bodyText = json.output || json.result || JSON.stringify(json, null, 2);
    } else {
      bodyText = await res.text();
    }

    console.log('\n--- Model response ---\n');
    console.log(bodyText);
    console.log('\n--- end ---\n');
  } catch (err) {
    console.error('Request failed:', err.message || err);
    process.exit(1);
  }
}

main();
