const {
  addShopItem,
  addTaskItem,
  toggleShopDone,
  toggleTaskDone,
  deleteListItem,
  filterTasks
} = require('../src/listManager');

describe('List Manager', () => {
  describe('addShopItem', () => {
    it('adds an item to the shopping list', () => {
      const result = addShopItem([], 'Milk');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ text: 'Milk', done: false });
    });

    it('trims whitespace from text', () => {
      const result = addShopItem([], '  Bread  ');
      expect(result[0].text).toBe('Bread');
    });

    it('does not add empty string', () => {
      expect(addShopItem([], '')).toEqual([]);
    });

    it('does not add whitespace-only string', () => {
      expect(addShopItem([], '   ')).toEqual([]);
    });

    it('does not add null', () => {
      expect(addShopItem([], null)).toEqual([]);
    });

    it('does not mutate original array', () => {
      const original = [{ text: 'Eggs', done: false }];
      const result = addShopItem(original, 'Butter');
      expect(original).toHaveLength(1);
      expect(result).toHaveLength(2);
    });

    it('preserves existing items', () => {
      const existing = [{ text: 'Eggs', done: true }];
      const result = addShopItem(existing, 'Flour');
      expect(result[0]).toEqual({ text: 'Eggs', done: true });
      expect(result[1]).toEqual({ text: 'Flour', done: false });
    });
  });

  describe('addTaskItem', () => {
    it('adds a task to the list', () => {
      const result = addTaskItem([], 'Clean kitchen');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ text: 'Clean kitchen', done: false });
    });

    it('trims whitespace from text', () => {
      const result = addTaskItem([], '  Do laundry  ');
      expect(result[0].text).toBe('Do laundry');
    });

    it('does not add empty string', () => {
      expect(addTaskItem([], '')).toEqual([]);
    });

    it('does not add null', () => {
      expect(addTaskItem([], null)).toEqual([]);
    });

    it('does not mutate original array', () => {
      const original = [{ text: 'Cook', done: false }];
      const result = addTaskItem(original, 'Wash');
      expect(original).toHaveLength(1);
      expect(result).toHaveLength(2);
    });
  });

  describe('toggleShopDone', () => {
    it('toggles done state from false to true', () => {
      const shopping = [{ text: 'Milk', done: false }];
      const result = toggleShopDone(shopping, 0);
      expect(result[0].done).toBe(true);
    });

    it('toggles done state from true to false', () => {
      const shopping = [{ text: 'Milk', done: true }];
      const result = toggleShopDone(shopping, 0);
      expect(result[0].done).toBe(false);
    });

    it('returns unchanged list for invalid index (negative)', () => {
      const shopping = [{ text: 'Milk', done: false }];
      const result = toggleShopDone(shopping, -1);
      expect(result).toEqual(shopping);
    });

    it('returns unchanged list for index out of bounds', () => {
      const shopping = [{ text: 'Milk', done: false }];
      const result = toggleShopDone(shopping, 5);
      expect(result).toEqual(shopping);
    });

    it('does not mutate original array', () => {
      const shopping = [{ text: 'Milk', done: false }];
      const result = toggleShopDone(shopping, 0);
      expect(shopping[0].done).toBe(false);
      expect(result[0].done).toBe(true);
    });
  });

  describe('toggleTaskDone', () => {
    it('toggles done state from false to true', () => {
      const tasks = [{ text: 'Clean', done: false }];
      const result = toggleTaskDone(tasks, 0);
      expect(result[0].done).toBe(true);
    });

    it('toggles done state from true to false', () => {
      const tasks = [{ text: 'Clean', done: true }];
      const result = toggleTaskDone(tasks, 0);
      expect(result[0].done).toBe(false);
    });

    it('returns unchanged list for invalid index', () => {
      const tasks = [{ text: 'Clean', done: false }];
      expect(toggleTaskDone(tasks, -1)).toEqual(tasks);
      expect(toggleTaskDone(tasks, 10)).toEqual(tasks);
    });

    it('does not mutate original array', () => {
      const tasks = [{ text: 'Clean', done: false }];
      toggleTaskDone(tasks, 0);
      expect(tasks[0].done).toBe(false);
    });
  });

  describe('deleteListItem', () => {
    it('removes item at specified index', () => {
      const list = [
        { text: 'A', done: false },
        { text: 'B', done: false },
        { text: 'C', done: false }
      ];
      const result = deleteListItem(list, 1);
      expect(result).toHaveLength(2);
      expect(result[0].text).toBe('A');
      expect(result[1].text).toBe('C');
    });

    it('removes first item', () => {
      const list = [{ text: 'A', done: false }, { text: 'B', done: false }];
      const result = deleteListItem(list, 0);
      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('B');
    });

    it('removes last item', () => {
      const list = [{ text: 'A', done: false }, { text: 'B', done: false }];
      const result = deleteListItem(list, 1);
      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('A');
    });

    it('returns unchanged list for negative index', () => {
      const list = [{ text: 'A', done: false }];
      expect(deleteListItem(list, -1)).toEqual(list);
    });

    it('returns unchanged list for out-of-bounds index', () => {
      const list = [{ text: 'A', done: false }];
      expect(deleteListItem(list, 5)).toEqual(list);
    });

    it('handles empty list', () => {
      expect(deleteListItem([], 0)).toEqual([]);
    });
  });

  describe('filterTasks', () => {
    const tasks = [
      { text: 'Done task', done: true },
      { text: 'Active task 1', done: false },
      { text: 'Active task 2', done: false }
    ];

    it('returns all tasks with "all" filter', () => {
      const result = filterTasks(tasks, 'all');
      expect(result).toHaveLength(3);
    });

    it('returns only incomplete tasks with "active" filter', () => {
      const result = filterTasks(tasks, 'active');
      expect(result).toHaveLength(2);
      expect(result.every(t => !t.done)).toBe(true);
    });

    it('returns only completed tasks with "done" filter', () => {
      const result = filterTasks(tasks, 'done');
      expect(result).toHaveLength(1);
      expect(result[0].done).toBe(true);
    });

    it('returns all tasks for unknown filter', () => {
      const result = filterTasks(tasks, 'unknown');
      expect(result).toHaveLength(3);
    });

    it('handles empty task list', () => {
      expect(filterTasks([], 'all')).toEqual([]);
      expect(filterTasks([], 'active')).toEqual([]);
      expect(filterTasks([], 'done')).toEqual([]);
    });
  });
});
