import MainSession from '../../common/models/MainSession';
import TabSession from '../../common/models/TabSession';
import StorageManager from '../../common/services/StorageManager';

/**
 * SessionManager - Manages session-related functionalities, such as starting, ending, and handling browser events for sessions.
 */
export default class SessionManager {
    currentTabSession: TabSession | null = null;
    currentMainSession: MainSession | null = null;

    constructor() {
        // Initializing and starting a new main session upon creation of SessionManager instance.
        this.startNewMainSession();
    }

    /**
     * startNewMainSession - Initializes and sets the starting time for a new MainSession and saves it immediately.
     */
    startNewMainSession(): void {
        this.currentMainSession = new MainSession(new Date().getTime());
        if (this.currentMainSession) {
            StorageManager.saveMainSession(this.currentMainSession);
        }
    }

    /**
     * startNewTabSession - Initializes and sets the starting time and domain for a new TabSession.
     * 
     * @param tab - The tab information received from browser events, used to determine the domain for the session.
     */
    startNewTabSession(tab: chrome.tabs.Tab): void {
        const domain = new URL(tab.url || '').hostname;
        this.currentTabSession = new TabSession(domain, new Date().getTime());
    }
    
    /**
     * endCurrentTabSession - Marks the end of the current TabSession, saves it to the current MainSession, and resets the current TabSession.
     */
    endCurrentTabSession(): void {
        if (this.currentTabSession) {
            this.currentTabSession.endSession(new Date().getTime());
            this.currentMainSession?.addTabSession(this.currentTabSession);
            this.currentTabSession = null;
            if(this.currentMainSession) {
                StorageManager.updateMainSession(this.currentMainSession);
            }
        }
    }

    /**
     * endCurrentMainSession - Marks the end of the current MainSession and updates it using StorageManager without starting a new MainSession.
     */
    endCurrentMainSession(): void {
        if (this.currentMainSession) {
            this.currentMainSession.endSession(new Date().getTime());
            StorageManager.updateMainSession(this.currentMainSession);
        }
    }

    /**
     * handleTabActivation - Manages session status upon tab activation by ending the current tab session and starting a new one.
     * 
     * @param tabId - The ID of the activated tab.
     */
    handleTabActivation(tabId: number): void {
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
    handleTabUpdate(tabId: number): void {
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
    handleWindowFocusChange(windowId: number): void {
        this.endCurrentTabSession();
        if (windowId !== chrome.windows.WINDOW_ID_NONE) {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (tabs[0]) {
                    this.startNewTabSession(tabs[0]);
                }
            });
        }
    }
}
