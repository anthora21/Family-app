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

## Testing recent fixes (date/sleep/XSS/export-import)
- **Sleep banner is date-scoped**: start a Dodo today → banner shows; click ◀ (previous day) → banner MUST disappear and button reverts to "😴 Dodo"; "Aujourd'hui" brings it back. If the banner shows on other days, `getOngoingSleep()`'s `e.date === currentDate` filter regressed.
- **XSS**: add a shopping item `<img src=x onerror="document.title='PWNED'">`. It must render as literal text and the tab title must stay "Family Organizer". Check the DOM shows escaped entities (`&lt;img ...&gt;`).
- **Local date (not UTC)**: header date should match the machine's local day. The drift only appears in non-UTC zones — demonstrate with Node: `TZ=America/Los_Angeles node -e '...'` comparing `toISOString().slice(0,10)` (old, wrong) vs a `getFullYear/Month/Date` builder (new, correct).
- **Cross-midnight duration**: pure logic, verify in Node — `getDurationMinutes('23:30','00:15')` must be `45`, not `-1395`.
- **IDs**: events/list items now use `genId()` (UUID). Exported JSON `id`s should be UUID strings, not millisecond numbers.

## Export / Import (💾 Données section on Listes tab)
Downloads and the native file-open dialog are painful to automate in this VM's Chrome:
- The **export download** may silently drop to a non-persisted path; it usually still lands in `~/Downloads/family-organizer-YYYY-MM-DD.json`. Verify by `cat`-ing that file (check `events`/`shopping`/`tasks`/`exportedAt`).
- The **import** button opens a native OS file dialog that computer-use can't drive cleanly. Workaround: drive the hidden `#importFile` input via the CDP endpoint (`http://localhost:29229`). Chrome runs with `--user-data-dir=/home/ubuntu/.browser_data_dir`. A small Node script using the `ws` package can `Target.attachToTarget` to the `Index.html` page, then `DOM.setFileInputFiles` on `#importFile` (fires `change` → `importData`). `Browser.setDownloadBehavior` can also route downloads to a known folder. This exercises the real `exportData`/`importData` code; only the OS dialog is bypassed — note this in the report.

## Notes
- Zoom into rows to confirm strikethrough — it's subtle at full-screen scale.
- Dates: app blocks navigating to future days; "Aujourd'hui" jumps to today.
- Duration format `Xh0Y` (padded minutes) is a strong assertion for any change touching time formatting — an unpadded `Xh0` or `NaN`/`undefined` means a formatting helper broke.
- There is now a real `sw.js` (was a broken blob-URL service worker). It only matters for offline/PWA caching; not part of the golden path.

## Devin Secrets Needed
None. Fully local, no auth.
