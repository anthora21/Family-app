---
name: testing-family-organizer
description: Test the Family Organizer PWA (single-file Index.html) end-to-end. Use when verifying UI/logic changes to the baby-tracking + lists app.
---

# Testing Family Organizer

The app is a **single static file** `Index.html` (vanilla JS, French UI, `localStorage` persistence). No build, no server, no dependencies, no CI configured.

## How to run
- Open directly in Chrome: `file:///home/ubuntu/repos/Family-app/Index.html`. No server needed.
- Syntax-check JS without a browser: extract the `<script>` block and run `node --check`, e.g.
  `sed -n '/<script>/,/<\/script>/p' Index.html | sed '1d;$d' > /tmp/app.js && node --check /tmp/app.js`

## Key UI facts (so tests aren't brittle)
- Two tabs at the bottom: **Suivi** (tracking) and **Listes** (shopping/tasks).
- Tracking buttons "🍼 Tétée", "💧 Couche", "😴 Dodo" trigger native `prompt()`/`confirm()` dialogs — you must click **OK** on the Chrome dialog (defaults are pre-filled: `g`=left breast, `p`=pipi). The feeding flow has TWO prompts (subtype, then optional duration).
- Sleep in progress shows a purple banner "Bébé dort depuis Xh0Y" and flips the Dodo button label to "⏰ Réveil".
- Lists: type in the input, click "+" or press Enter. Checkbox toggles `completed` (strikethrough). Task filters: Toutes / À faire / Fait. 🗑️ deletes.

## localStorage keys
`family_events`, `family_shopping`, `family_tasks`. To reset state between runs, clear these (or use a fresh profile). Persistence is best verified by an **F5 reload** — data should survive.

## Golden-path test (covers most logic)
1. Suivi: add a Tétée + a Couche → summary shows `🍼 1` / `💧 1`, rows appear.
2. Start a Dodo → banner "Bébé dort depuis 0h00" (note zero-padded minutes — good signal for duration/pad formatting).
3. Listes: add a shopping item + a task, toggle done (strikethrough), use "À faire" filter (completed task hidden), delete an item.
4. Reload (F5) → all data persists.

## Notes
- Zoom into rows to confirm strikethrough — it's subtle at full-screen scale.
- Dates: app blocks navigating to future days; "Aujourd'hui" jumps to today.
- Duration format `Xh0Y` (padded minutes) is a strong assertion for any change touching time formatting — an unpadded `Xh0` or `NaN`/`undefined` means a formatting helper broke.

## Devin Secrets Needed
None. Fully local, no auth.
