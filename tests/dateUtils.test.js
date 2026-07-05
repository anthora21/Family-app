const {
  formatDateFr,
  getTodayStr,
  changeDay,
  getDurationMinutes,
  getCurrentTime
} = require('../src/dateUtils');

describe('Date utilities', () => {
  describe('formatDateFr', () => {
    it('formats a date string in French locale', () => {
      const result = formatDateFr('2025-03-15');
      // Should contain day number and year
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });

    it('handles first day of year', () => {
      const result = formatDateFr('2025-01-01');
      expect(result).toContain('1');
      expect(result).toContain('2025');
    });

    it('handles last day of year', () => {
      const result = formatDateFr('2025-12-31');
      expect(result).toContain('31');
      expect(result).toContain('2025');
    });
  });

  describe('getTodayStr', () => {
    it('returns a string in YYYY-MM-DD format', () => {
      const result = getTodayStr();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('returns today\'s date', () => {
      const now = new Date();
      const expected = now.toISOString().slice(0, 10);
      expect(getTodayStr()).toBe(expected);
    });
  });

  describe('changeDay', () => {
    it('moves forward by one day', () => {
      // Use a past date to avoid future-date restriction
      const result = changeDay('2024-01-15', 1);
      expect(result).toBe('2024-01-16');
    });

    it('moves backward by one day', () => {
      const result = changeDay('2024-01-15', -1);
      expect(result).toBe('2024-01-14');
    });

    it('does not allow going to future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().slice(0, 10);
      const today = getTodayStr();
      // Trying to go forward from today should stay on today
      const result = changeDay(today, 1);
      expect(result).toBe(today);
    });

    it('handles month boundaries', () => {
      const result = changeDay('2024-01-31', 1);
      expect(result).toBe('2024-02-01');
    });

    it('handles year boundaries', () => {
      const result = changeDay('2023-12-31', 1);
      expect(result).toBe('2024-01-01');
    });

    it('moves backward across month boundary', () => {
      const result = changeDay('2024-03-01', -1);
      expect(result).toBe('2024-02-29'); // 2024 is a leap year
    });

    it('handles negative multi-day delta', () => {
      const result = changeDay('2024-01-10', -5);
      expect(result).toBe('2024-01-05');
    });
  });

  describe('getDurationMinutes', () => {
    it('calculates duration between two times', () => {
      expect(getDurationMinutes('08:00', '09:30')).toBe(90);
    });

    it('returns 0 for same time', () => {
      expect(getDurationMinutes('14:00', '14:00')).toBe(0);
    });

    it('handles short durations', () => {
      expect(getDurationMinutes('10:00', '10:15')).toBe(15);
    });

    it('handles multi-hour durations', () => {
      expect(getDurationMinutes('06:00', '18:00')).toBe(720);
    });

    it('handles minutes-only difference', () => {
      expect(getDurationMinutes('12:30', '12:45')).toBe(15);
    });

    it('returns negative for reversed times', () => {
      expect(getDurationMinutes('10:00', '08:00')).toBe(-120);
    });
  });

  describe('getCurrentTime', () => {
    it('returns a time string in HH:MM format', () => {
      const result = getCurrentTime();
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('returns current hour and minute', () => {
      const now = new Date();
      const expected = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      expect(getCurrentTime()).toBe(expected);
    });
  });
});
