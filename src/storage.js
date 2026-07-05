/**
 * Storage module - handles localStorage persistence for events, shopping, and tasks.
 */

const STORAGE_EVENTS = 'family_events';
const STORAGE_SHOPPING = 'family_shopping';
const STORAGE_TASKS = 'family_tasks';

function loadEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_EVENTS)) || [];
  } catch {
    return [];
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
}

function loadShopping() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_SHOPPING)) || [];
  } catch {
    return [];
  }
}

function saveShopping(list) {
  localStorage.setItem(STORAGE_SHOPPING, JSON.stringify(list));
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_TASKS)) || [];
  } catch {
    return [];
  }
}

function saveTasks(list) {
  localStorage.setItem(STORAGE_TASKS, JSON.stringify(list));
}

module.exports = {
  STORAGE_EVENTS,
  STORAGE_SHOPPING,
  STORAGE_TASKS,
  loadEvents,
  saveEvents,
  loadShopping,
  saveShopping,
  loadTasks,
  saveTasks
};
