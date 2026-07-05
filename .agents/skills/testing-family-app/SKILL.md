---
name: testing-family-app
description: Test the Family Organizer app end-to-end. Use when verifying UI, localStorage, error handling, or regression after code changes.
---

# Testing the Family Organizer App

## Setup

The app is a single `Index.html` file with no build step or dependencies.

```bash
cd /home/ubuntu/repos/Family-app
python3 -m http.server 8080 &
```

Open `http://localhost:8080/Index.html` in Chrome.

## Key Testing Patterns

### Error handling via DevTools console

The app uses `[Family]` prefix for all logged errors/warnings. Open DevTools (F12) > Console tab to observe.

**Corrupt localStorage:** Inject invalid data, reload, and verify console output:
```js
// Non-array data -> should warn
window.localStorage.setItem('family_events', JSON.stringify({"not":"an_array"}));
location.reload();
// Expected: [Family] Données corrompues dans "family_events" ...

// Invalid JSON -> should error
window.localStorage.setItem('family_events', '{broken json!!}');
location.reload();
// Expected: [Family] Impossible de lire "family_events" ... SyntaxError
```

**Clear state for clean testing:**
```js
window.localStorage.clear();
location.reload();
```

### Overnight sleep duration

The `getDurationMinutes` function handles overnight sleep (crossing midnight). Test by injecting:
```js
var evts = JSON.parse(window.localStorage.getItem('family_events')) || [];
evts.push({
  id: Date.now(), type:'sleep', subtype:'nap',
  date: new Date().toISOString().slice(0,10),
  startTime:'23:00', endTime:'01:00', durationMin:null
});
window.localStorage.setItem('family_events', JSON.stringify(evts));
location.reload();
// Expected: "Dodo 2h00" (not negative or NaN)
```

### Invalid panel switching

Test the `switchPanel` guard by modifying a nav-tab's `data-panel` attribute:
```js
document.querySelector('.nav-tab[data-panel="listsPanel"]').dataset.panel = 'invalidPanel';
// Then click the "Listes" tab in the UI
// Expected: [Family] switchPanel : panneau ou onglet introuvable (no crash)
```

### Regression: Normal app flow

1. Add feeding (click Tétée, enter "g", enter duration)
2. Add diaper (click Couche, enter "p")
3. Start/stop sleep (click Dodo, confirm, then click Réveil)
4. Switch to Listes tab
5. Add/check/delete shopping item
6. Add/check/delete task
7. Verify no `[Family]` errors in console throughout

## Notes

- The app uses `prompt()` and `confirm()` dialogs for input — click OK/Cancel in the browser dialog.
- The Service Worker registration might fail locally with a blob: URL protocol error — this is expected in local dev and the error is now properly logged.
- localStorage keys: `family_events`, `family_shopping`, `family_tasks`.
- No CI is configured; testing is manual via browser.

## Devin Secrets Needed

None — the app is a standalone HTML file with no backend or authentication.
