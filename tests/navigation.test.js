const { switchPanel, isValidPanel } = require('../src/navigation');

describe('Navigation module', () => {
  const validPanels = ['trackingPanel', 'listsPanel'];

  describe('switchPanel', () => {
    it('returns the panel id for a valid panel', () => {
      expect(switchPanel('trackingPanel', validPanels)).toBe('trackingPanel');
      expect(switchPanel('listsPanel', validPanels)).toBe('listsPanel');
    });

    it('returns null for an invalid panel', () => {
      expect(switchPanel('invalidPanel', validPanels)).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(switchPanel('', validPanels)).toBeNull();
    });

    it('returns null for undefined', () => {
      expect(switchPanel(undefined, validPanels)).toBeNull();
    });
  });

  describe('isValidPanel', () => {
    it('returns true for valid panel ids', () => {
      expect(isValidPanel('trackingPanel', validPanels)).toBe(true);
      expect(isValidPanel('listsPanel', validPanels)).toBe(true);
    });

    it('returns false for invalid panel ids', () => {
      expect(isValidPanel('settingsPanel', validPanels)).toBe(false);
      expect(isValidPanel('', validPanels)).toBe(false);
    });
  });
});
