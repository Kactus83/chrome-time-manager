import SessionsManager from './SessionsManager';

/**
 * ChromeActivityHandler - Handles Chrome tab and window activity, managing sessions through the SessionsManager.
 */
export default class ChromeActivityHandler {
    sessionsManager: SessionsManager;

    constructor() {
        this.sessionsManager = new SessionsManager();
        this.sessionsManager.startMainSession();    

        // Initializing event listeners
        chrome.tabs.onActivated.addListener(this.handleTabActivation.bind(this));
        chrome.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
        chrome.windows.onFocusChanged.addListener(this.handleWindowFocusChange.bind(this));
    }

    /**
     * handleTabActivation - Manages session data upon tab activation, starting new tab sessions accordingly.
     * 
     * @param activeInfo - Information about the activated tab.
     */
    handleTabActivation(activeInfo: chrome.tabs.TabActiveInfo): void {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (tab.url && tab.active) {  // Ensure tab is active
                const domain = new URL(tab.url).hostname;
                this.sessionsManager.endTabSession();
                this.sessionsManager.startTabSession(domain);
            }
        });
    }

    /**
     * handleTabUpdate - Manages session data upon tab update, starting new tab sessions accordingly.
     * 
     * @param tabId - The ID of the updated tab.
     * @param changeInfo - Object containing information about the updated tab.
     */
    handleTabUpdate(tabId: number, changeInfo: chrome.tabs.TabChangeInfo): void {
        if (changeInfo.status === "complete") {
            chrome.tabs.get(tabId, (tab) => {
                if (tab.url && tab.active) {  // Ensure tab is active
                    const domain = new URL(tab.url).hostname;
                    this.sessionsManager.endTabSession();
                    this.sessionsManager.startTabSession(domain);
                }
            });
        }
    }

    /**
     * handleWindowFocusChange - Manages session data upon window focus change, starting new tab sessions accordingly.
     * 
     * @param windowId - The ID of the focused window.
     */
    handleWindowFocusChange(windowId: number): void {
        if (windowId !== chrome.windows.WINDOW_ID_NONE) {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (tabs[0]?.url) {
                    const domain = new URL(tabs[0].url).hostname;
                    this.sessionsManager.endTabSession();
                    this.sessionsManager.startTabSession(domain);
                }
            });
        }
    }

    /**
     * handleWindowRemoved - Handles chrome window closure, ensuring MainSession ends when all windows are closed.
     */
    handleWindowRemoved(): void {
        // Check if there are no more windows open
        chrome.windows.getAll({}, (windows) => {
            if (windows.length === 0) {
                this.sessionsManager.endMainSession();
            }
        });
    }
}
