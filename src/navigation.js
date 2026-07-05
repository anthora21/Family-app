/**
 * Navigation module - handles panel switching logic.
 */

function switchPanel(panelId, validPanels) {
  if (!validPanels.includes(panelId)) return null;
  return panelId;
}

function isValidPanel(panelId, validPanels) {
  return validPanels.includes(panelId);
}

module.exports = {
  switchPanel,
  isValidPanel
};
