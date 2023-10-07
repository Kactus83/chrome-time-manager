import MainSession from '../../common/models/MainSession';
import TabSession from '../../common/models/TabSession';
import StorageManager from '../../common/services/StorageManager';
/**
 * SessionManager - Manages session-related functionalities, such as starting, ending, and handling browser events for sessions.
 */
export default class SessionManager {
    constructor() {
        this.currentTabSession = null;
        this.currentMainSession = null;
        // Initializing and starting a new main session upon creation of SessionManager instance.
        this.startNewMainSession();
    }
    /**
     * startNewMainSession - Initializes and sets the starting time for a new MainSession.
     */
    startNewMainSession() {
        this.currentMainSession = new MainSession(new Date().getTime());
    }
    /**
     * startNewTabSession - Initializes and sets the starting time and domain for a new TabSession.
     *
     * @param tab - The tab information received from browser events, used to determine the domain for the session.
     */
    startNewTabSession(tab) {
        const domain = new URL(tab.url || '').hostname;
        this.currentTabSession = new TabSession(domain, new Date().getTime());
    }
    /**
     * endCurrentTabSession - Marks the end of the current TabSession, saves it to the current MainSession, and resets the current TabSession.
     */
    endCurrentTabSession() {
        var _a;
        if (this.currentTabSession) {
            this.currentTabSession.endSession(new Date().getTime());
            (_a = this.currentMainSession) === null || _a === void 0 ? void 0 : _a.addTabSession(this.currentTabSession);
            this.currentTabSession = null;
        }
    }
    /**
     * endCurrentMainSession - Marks the end of the current MainSession, saves it using StorageManager, and starts a new MainSession.
     */
    endCurrentMainSession() {
        if (this.currentMainSession) {
            this.currentMainSession.endSession(new Date().getTime());
            StorageManager.saveMainSession(this.currentMainSession);
            this.startNewMainSession();
        }
    }
    /**
     * handleTabActivation - Manages session status upon tab activation by ending the current tab session and starting a new one.
     *
     * @param tabId - The ID of the activated tab.
     */
    handleTabActivation(tabId) {
        this.endCurrentTabSession();
        chrome.tabs.get(tabId, (tab) => {
            this.startNewTabSession(tab);
        });
    }
    /**
     * handleTabUpdate - Manages session status upon tab update by ending the current tab session and starting a new one.
     *
     * @param tabId - The ID of the updated tab.
     */
    handleTabUpdate(tabId) {
        this.endCurrentTabSession();
        chrome.tabs.get(tabId, (tab) => {
            this.startNewTabSession(tab);
        });
    }
    /**
     * handleWindowFocusChange - Manages session status upon window focus change by ending the current tab session and starting a new one if applicable.
     *
     * @param windowId - The ID of the focused window.
     */
    handleWindowFocusChange(windowId) {
        this.endCurrentTabSession();
        if (windowId !== chrome.windows.WINDOW_ID_NONE) {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                if (tabs[0]) {
                    this.startNewTabSession(tabs[0]);
                }
            });
        }
    }
}
