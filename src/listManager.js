/**
 * List management module - handles shopping list and task list operations.
 */

function addShopItem(shopping, text) {
  if (!text || !text.trim()) return shopping;
  return [...shopping, { text: text.trim(), done: false }];
}

function addTaskItem(tasks, text) {
  if (!text || !text.trim()) return tasks;
  return [...tasks, { text: text.trim(), done: false }];
}

function toggleShopDone(shopping, index) {
  if (index < 0 || index >= shopping.length) return shopping;
  const updated = [...shopping];
  updated[index] = { ...updated[index], done: !updated[index].done };
  return updated;
}

function toggleTaskDone(tasks, index) {
  if (index < 0 || index >= tasks.length) return tasks;
  const updated = [...tasks];
  updated[index] = { ...updated[index], done: !updated[index].done };
  return updated;
}

function deleteListItem(list, index) {
  if (index < 0 || index >= list.length) return list;
  return list.filter((_, i) => i !== index);
}

function filterTasks(tasks, filter) {
  if (filter === 'active') return tasks.filter(t => !t.done);
  if (filter === 'done') return tasks.filter(t => t.done);
  return tasks;
}

module.exports = {
  addShopItem,
  addTaskItem,
  toggleShopDone,
  toggleTaskDone,
  deleteListItem,
  filterTasks
};
