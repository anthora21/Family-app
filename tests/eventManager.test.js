const {
  getDayEvents,
  getOngoingSleep,
  createEvent,
  addEvent,
  wakeUp,
  deleteEvent,
  getDaySummary,
  parseFeedingSubtype,
  parseDiaperSubtype
} = require('../src/eventManager');

describe('Event Manager', () => {
  const sampleEvents = [
    { id: 1, type: 'feeding', subtype: 'left', date: '2025-03-10', startTime: '08:30', endTime: null, durationMin: 15 },
    { id: 2, type: 'diaper', subtype: 'pee', date: '2025-03-10', startTime: '09:00', endTime: null, durationMin: null },
    { id: 3, type: 'sleep', subtype: 'nap', date: '2025-03-10', startTime: '10:00', endTime: '11:30', durationMin: null },
    { id: 4, type: 'feeding', subtype: 'bottle', date: '2025-03-11', startTime: '07:00', endTime: null, durationMin: null },
    { id: 5, type: 'sleep', subtype: 'nap', date: '2025-03-10', startTime: '14:00', endTime: null, durationMin: null }
  ];

  describe('getDayEvents', () => {
    it('returns events for a specific date sorted by startTime', () => {
      const result = getDayEvents(sampleEvents, '2025-03-10');
      expect(result).toHaveLength(4);
      expect(result[0].startTime).toBe('08:30');
      expect(result[1].startTime).toBe('09:00');
      expect(result[2].startTime).toBe('10:00');
      expect(result[3].startTime).toBe('14:00');
    });

    it('returns empty array for date with no events', () => {
      const result = getDayEvents(sampleEvents, '2025-03-15');
      expect(result).toEqual([]);
    });

    it('returns only events for the specified date', () => {
      const result = getDayEvents(sampleEvents, '2025-03-11');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(4);
    });

    it('handles empty events array', () => {
      expect(getDayEvents([], '2025-03-10')).toEqual([]);
    });
  });

  describe('getOngoingSleep', () => {
    it('finds an ongoing sleep event (no endTime)', () => {
      const result = getOngoingSleep(sampleEvents);
      expect(result).toBeDefined();
      expect(result.id).toBe(5);
      expect(result.endTime).toBeNull();
    });

    it('returns undefined when no ongoing sleep', () => {
      const events = [
        { id: 1, type: 'sleep', subtype: 'nap', date: '2025-03-10', startTime: '10:00', endTime: '11:00' },
        { id: 2, type: 'feeding', subtype: 'left', date: '2025-03-10', startTime: '08:00', endTime: null }
      ];
      expect(getOngoingSleep(events)).toBeUndefined();
    });

    it('returns undefined for empty events', () => {
      expect(getOngoingSleep([])).toBeUndefined();
    });
  });

  describe('createEvent', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-03-10T14:30:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('creates a feeding event', () => {
      const event = createEvent('feeding', 'left', '2025-03-10', { durationMin: 10 });
      expect(event.type).toBe('feeding');
      expect(event.subtype).toBe('left');
      expect(event.date).toBe('2025-03-10');
      expect(event.startTime).toBe('14:30');
      expect(event.endTime).toBeNull();
      expect(event.durationMin).toBe(10);
      expect(event.id).toBeDefined();
    });

    it('creates a diaper event', () => {
      const event = createEvent('diaper', 'poop', '2025-03-10');
      expect(event.type).toBe('diaper');
      expect(event.subtype).toBe('poop');
      expect(event.durationMin).toBeNull();
    });

    it('creates a sleep event with null endTime', () => {
      const event = createEvent('sleep', 'nap', '2025-03-10');
      expect(event.type).toBe('sleep');
      expect(event.endTime).toBeNull();
    });
  });

  describe('addEvent', () => {
    it('adds a new event to the events array', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-03-10T12:00:00'));

      const events = [];
      const result = addEvent(events, 'feeding', 'bottle', '2025-03-10');
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('feeding');
      expect(result[0].subtype).toBe('bottle');

      jest.useRealTimers();
    });

    it('does not mutate the original array', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-03-10T12:00:00'));

      const events = [{ id: 1, type: 'feeding' }];
      const result = addEvent(events, 'diaper', 'pee', '2025-03-10');
      expect(events).toHaveLength(1);
      expect(result).toHaveLength(2);

      jest.useRealTimers();
    });
  });

  describe('wakeUp', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-03-10T15:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('sets endTime on ongoing sleep event', () => {
      const events = [
        { id: 1, type: 'sleep', subtype: 'nap', date: '2025-03-10', startTime: '14:00', endTime: null }
      ];
      const result = wakeUp(events);
      expect(result[0].endTime).toBe('15:00');
    });

    it('does nothing when no ongoing sleep', () => {
      const events = [
        { id: 1, type: 'sleep', subtype: 'nap', date: '2025-03-10', startTime: '10:00', endTime: '11:00' }
      ];
      const result = wakeUp(events);
      expect(result[0].endTime).toBe('11:00');
    });
  });

  describe('deleteEvent', () => {
    it('removes event by id', () => {
      const result = deleteEvent(sampleEvents, 2);
      expect(result).toHaveLength(4);
      expect(result.find(e => e.id === 2)).toBeUndefined();
    });

    it('returns same array if id not found', () => {
      const result = deleteEvent(sampleEvents, 999);
      expect(result).toHaveLength(5);
    });

    it('handles empty array', () => {
      expect(deleteEvent([], 1)).toEqual([]);
    });
  });

  describe('getDaySummary', () => {
    it('calculates correct summary for a day', () => {
      const events = [
        { id: 1, type: 'feeding', date: '2025-03-10', startTime: '08:00', endTime: null },
        { id: 2, type: 'feeding', date: '2025-03-10', startTime: '12:00', endTime: null },
        { id: 3, type: 'diaper', date: '2025-03-10', startTime: '09:00', endTime: null },
        { id: 4, type: 'sleep', date: '2025-03-10', startTime: '10:00', endTime: '11:30' },
        { id: 5, type: 'sleep', date: '2025-03-10', startTime: '14:00', endTime: '15:00' }
      ];
      const summary = getDaySummary(events, '2025-03-10');
      expect(summary.feedings).toBe(2);
      expect(summary.diapers).toBe(1);
      expect(summary.sleepTotal).toBe(150); // 90 + 60 minutes
      expect(summary.sleepHours).toBe(2);
      expect(summary.sleepMins).toBe(30);
    });

    it('returns zeros for empty day', () => {
      const summary = getDaySummary([], '2025-03-10');
      expect(summary.feedings).toBe(0);
      expect(summary.diapers).toBe(0);
      expect(summary.sleepTotal).toBe(0);
      expect(summary.sleepHours).toBe(0);
      expect(summary.sleepMins).toBe(0);
    });

    it('ignores ongoing sleep (no endTime) in total', () => {
      const events = [
        { id: 1, type: 'sleep', date: '2025-03-10', startTime: '14:00', endTime: null }
      ];
      const summary = getDaySummary(events, '2025-03-10');
      expect(summary.sleepTotal).toBe(0);
    });
  });

  describe('parseFeedingSubtype', () => {
    it('returns "left" for empty input', () => {
      expect(parseFeedingSubtype('')).toBe('left');
      expect(parseFeedingSubtype(null)).toBe('left');
      expect(parseFeedingSubtype(undefined)).toBe('left');
    });

    it('returns "right" for inputs starting with "d"', () => {
      expect(parseFeedingSubtype('d')).toBe('right');
      expect(parseFeedingSubtype('droit')).toBe('right');
      expect(parseFeedingSubtype('D')).toBe('right');
    });

    it('returns "bottle" for inputs starting with "b"', () => {
      expect(parseFeedingSubtype('b')).toBe('bottle');
      expect(parseFeedingSubtype('biberon')).toBe('bottle');
      expect(parseFeedingSubtype('B')).toBe('bottle');
    });

    it('returns "left" for inputs starting with "g"', () => {
      expect(parseFeedingSubtype('g')).toBe('left');
      expect(parseFeedingSubtype('gauche')).toBe('left');
    });

    it('returns "left" for unrecognized input', () => {
      expect(parseFeedingSubtype('x')).toBe('left');
    });
  });

  describe('parseDiaperSubtype', () => {
    it('returns "pee" for empty input', () => {
      expect(parseDiaperSubtype('')).toBe('pee');
      expect(parseDiaperSubtype(null)).toBe('pee');
      expect(parseDiaperSubtype(undefined)).toBe('pee');
    });

    it('returns "both" for "2" or "deux"', () => {
      expect(parseDiaperSubtype('2')).toBe('both');
      expect(parseDiaperSubtype('deux')).toBe('both');
      expect(parseDiaperSubtype('Deux')).toBe('both');
    });

    it('returns "poop" for inputs starting with "c"', () => {
      expect(parseDiaperSubtype('c')).toBe('poop');
      expect(parseDiaperSubtype('caca')).toBe('poop');
      expect(parseDiaperSubtype('C')).toBe('poop');
    });

    it('returns "pee" for inputs starting with "p"', () => {
      expect(parseDiaperSubtype('p')).toBe('pee');
      expect(parseDiaperSubtype('pipi')).toBe('pee');
    });

    it('returns "pee" for unrecognized input', () => {
      expect(parseDiaperSubtype('x')).toBe('pee');
    });
  });
});
