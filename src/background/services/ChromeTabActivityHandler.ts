import SessionsManager from './SessionsManager';

/**
 * ChromeTabActivityHandler - Manages tab sessions in Chrome, including handling tab activation and updates.
 */
export default class ChromeTabActivityHandler {
    private sessionsManager: SessionsManager;

    /**
     * Constructor - Initializes the ChromeTabActivityHandler class.
     *
     * @param sessionsManager - An instance of SessionsManager to handle session-related operations.
     */
    constructor(sessionsManager: SessionsManager) {
        this.sessionsManager = sessionsManager;

        chrome.tabs.onActivated.addListener(this.handleTabActivation.bind(this));
        chrome.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
    }

    /**
     * handleTabActivation - Handles tab activation, ends the current tab session, and starts a new one for the activated tab.
     *
     * @param activeInfo - Information about the activated tab.
     */
    private handleTabActivation(activeInfo: chrome.tabs.TabActiveInfo): void {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (tab.url && tab.active) {
                const domain = new URL(tab.url).hostname;
                this.sessionsManager.endTabSession();
                this.sessionsManager.startTabSession(domain);
            }
        });
    }

    /**
     * handleTabUpdate - Handles tab updates, ends the current tab session, and starts a new one for the updated tab if it's active.
     *
     * @param tabId - The ID of the updated tab.
     * @param changeInfo - Information about the changes to the updated tab.
     */
    private handleTabUpdate(tabId: number, changeInfo: chrome.tabs.TabChangeInfo): void {
        if (changeInfo.status === "complete") {
            chrome.tabs.get(tabId, (tab) => {
                if (tab.url && tab.active) {
                    const domain = new URL(tab.url).hostname;
                    this.sessionsManager.endTabSession();
                    this.sessionsManager.startTabSession(domain);
                }
            });
        }
    }
}
