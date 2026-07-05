const {
  STORAGE_EVENTS,
  STORAGE_SHOPPING,
  STORAGE_TASKS,
  loadEvents,
  saveEvents,
  loadShopping,
  saveShopping,
  loadTasks,
  saveTasks
} = require('../src/storage');

describe('Storage module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadEvents', () => {
    it('returns empty array when no data stored', () => {
      expect(loadEvents()).toEqual([]);
    });

    it('returns parsed events from localStorage', () => {
      const events = [{ id: 1, type: 'feeding', date: '2025-01-01' }];
      localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
      expect(loadEvents()).toEqual(events);
    });

    it('returns empty array on invalid JSON', () => {
      localStorage.setItem(STORAGE_EVENTS, 'invalid-json{{{');
      expect(loadEvents()).toEqual([]);
    });

    it('returns empty array when stored value is null', () => {
      localStorage.setItem(STORAGE_EVENTS, JSON.stringify(null));
      expect(loadEvents()).toEqual([]);
    });
  });

  describe('saveEvents', () => {
    it('persists events to localStorage', () => {
      const events = [
        { id: 1, type: 'feeding', subtype: 'left', date: '2025-03-10', startTime: '08:30' },
        { id: 2, type: 'diaper', subtype: 'pee', date: '2025-03-10', startTime: '09:00' }
      ];
      saveEvents(events);
      expect(JSON.parse(localStorage.getItem(STORAGE_EVENTS))).toEqual(events);
    });

    it('overwrites previous data', () => {
      saveEvents([{ id: 1 }]);
      saveEvents([{ id: 2 }]);
      expect(JSON.parse(localStorage.getItem(STORAGE_EVENTS))).toEqual([{ id: 2 }]);
    });
  });

  describe('loadShopping', () => {
    it('returns empty array when no data stored', () => {
      expect(loadShopping()).toEqual([]);
    });

    it('returns parsed shopping list from localStorage', () => {
      const list = [{ text: 'Milk', done: false }];
      localStorage.setItem(STORAGE_SHOPPING, JSON.stringify(list));
      expect(loadShopping()).toEqual(list);
    });

    it('returns empty array on invalid JSON', () => {
      localStorage.setItem(STORAGE_SHOPPING, '{{bad');
      expect(loadShopping()).toEqual([]);
    });
  });

  describe('saveShopping', () => {
    it('persists shopping list to localStorage', () => {
      const list = [{ text: 'Bread', done: true }];
      saveShopping(list);
      expect(JSON.parse(localStorage.getItem(STORAGE_SHOPPING))).toEqual(list);
    });
  });

  describe('loadTasks', () => {
    it('returns empty array when no data stored', () => {
      expect(loadTasks()).toEqual([]);
    });

    it('returns parsed tasks from localStorage', () => {
      const tasks = [{ text: 'Clean', done: false }];
      localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
      expect(loadTasks()).toEqual(tasks);
    });

    it('returns empty array on invalid JSON', () => {
      localStorage.setItem(STORAGE_TASKS, 'not-json');
      expect(loadTasks()).toEqual([]);
    });
  });

  describe('saveTasks', () => {
    it('persists tasks to localStorage', () => {
      const tasks = [{ text: 'Laundry', done: false }];
      saveTasks(tasks);
      expect(JSON.parse(localStorage.getItem(STORAGE_TASKS))).toEqual(tasks);
    });
  });

  describe('Storage keys', () => {
    it('uses correct key names', () => {
      expect(STORAGE_EVENTS).toBe('family_events');
      expect(STORAGE_SHOPPING).toBe('family_shopping');
      expect(STORAGE_TASKS).toBe('family_tasks');
    });
  });
});
