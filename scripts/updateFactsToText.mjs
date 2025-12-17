#!/usr/bin/env node

// Script: updateFactsToText.mjs
// Purpose: Fetch facts from API and update each fact so the 'number' field is stored as text (string)

const endpoint = 'https://glowac-api.onrender.com/facts';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  try {
    console.log('Fetching facts from', endpoint);
    const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Unexpected response (not an array)');

    console.log(`Found ${data.length} facts. Updating each to ensure 'number' is text.`);

    let success = 0;
    let failed = 0;

    for (const f of data) {
      const id = String(f.id ?? '');
      if (!id) {
        console.warn('Skipping fact without id', f);
        failed++;
        continue;
      }
      const label = String(f.label ?? '');
      // prefer value/property 'number' or fallback to 'value' or empty
      const numberRaw = f.number ?? f.value ?? '';
      const numberStr = String(numberRaw);
      const status = f.status ?? 'Visible';

      const body = new URLSearchParams();
      body.append('label', label);
      body.append('number', numberStr);
      body.append('status', status);

      try {
        const put = await fetch(`${endpoint}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
          body: body.toString(),
        });
        if (!put.ok) {
          console.error(`Failed to update fact id=${id}: ${put.status} ${put.statusText}`);
          failed++;
        } else {
          console.log(`Updated fact id=${id} label="${label}" number="${numberStr}"`);
          success++;
        }
      } catch (err) {
        console.error('Network error updating id=', id, err);
        failed++;
      }

      // small delay to avoid hammering the API
      await sleep(150);
    }

    console.log(`Done. Success: ${success}, Failed: ${failed}`);
  } catch (err) {
    console.error('Script failed:', err);
    process.exitCode = 1;
  }
}

run();
