// Refresh the exact public mapping used by the former deck-import endpoint.
// Run deliberately when creating a new service release, never on a request.
const fs = require('node:fs/promises');
const path = require('node:path');
const URL = 'https://amydev.me/twinleaf-json/image-jsons/limitlesstcg/large.json';
(async () => {
  const response = await fetch(URL, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Image-map HTTP ${response.status}`);
  const data = await response.json();
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).length < 10000 ||
      Object.values(data).some(value => typeof value !== 'string')) throw new Error('Image-map response is incomplete or invalid');
  const target = path.join(__dirname, 'large-card-images.json');
  const temporary = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(data));
  await fs.rename(temporary, target);
  console.log(`Saved ${Object.keys(data).length} image mappings`);
})().catch(error => { console.error(error); process.exitCode = 1; });
