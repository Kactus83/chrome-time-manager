import SessionManager from './services/SessionManager';

const sessionManager = new SessionManager();

/**
 * Event Listeners and Triggers
 */
chrome.tabs.onActivated.addListener(activeInfo => {
    sessionManager.handleTabActivation(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "complete" && sessionManager.currentTabSession) {
        sessionManager.handleTabUpdate(tabId);
    }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
    sessionManager.handleWindowFocusChange(windowId);
});
