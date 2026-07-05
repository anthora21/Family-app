/**
 * Event management module - handles baby tracking events (feeding, diaper, sleep).
 */

const { getCurrentTime } = require('./dateUtils');

function getDayEvents(events, dateStr) {
  return events
    .filter(e => e.date === dateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function getOngoingSleep(events) {
  return events.find(e => e.type === 'sleep' && !e.endTime);
}

function createEvent(type, subtype, currentDate, extra = {}) {
  const now = getCurrentTime();
  return {
    id: Date.now(),
    type,
    subtype,
    date: currentDate,
    startTime: now,
    endTime: null,
    durationMin: extra.durationMin || null
  };
}

function addEvent(events, type, subtype, currentDate, extra = {}) {
  const event = createEvent(type, subtype, currentDate, extra);
  return [...events, event];
}

function wakeUp(events) {
  const ongoing = getOngoingSleep(events);
  if (ongoing) {
    ongoing.endTime = getCurrentTime();
  }
  return events;
}

function deleteEvent(events, id) {
  return events.filter(e => e.id !== id);
}

function getDaySummary(events, dateStr) {
  const dayEvents = getDayEvents(events, dateStr);
  const feedings = dayEvents.filter(e => e.type === 'feeding').length;
  const diapers = dayEvents.filter(e => e.type === 'diaper').length;

  const { getDurationMinutes } = require('./dateUtils');
  const sleepTotal = dayEvents
    .filter(e => e.type === 'sleep' && e.endTime)
    .reduce((sum, e) => sum + (getDurationMinutes(e.startTime, e.endTime) || 0), 0);

  const sleepHours = Math.floor(sleepTotal / 60);
  const sleepMins = sleepTotal % 60;

  return { feedings, diapers, sleepHours, sleepMins, sleepTotal };
}

function parseFeedingSubtype(input) {
  if (!input) return 'left';
  if (input.toLowerCase().startsWith('d')) return 'right';
  if (input.toLowerCase().startsWith('b')) return 'bottle';
  return 'left';
}

function parseDiaperSubtype(input) {
  if (!input) return 'pee';
  if (input === '2' || input.toLowerCase() === 'deux') return 'both';
  if (input.toLowerCase().startsWith('c')) return 'poop';
  return 'pee';
}

module.exports = {
  getDayEvents,
  getOngoingSleep,
  createEvent,
  addEvent,
  wakeUp,
  deleteEvent,
  getDaySummary,
  parseFeedingSubtype,
  parseDiaperSubtype
};
