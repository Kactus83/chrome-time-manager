import SessionsManager from './SessionsManager';

/**
 * ChromeMainActivityHandler - Manages the main sessions in Chrome, including handling the focus changes and removal of windows.
 */
export default class ChromeMainActivityHandler {
    private sessionsManager: SessionsManager;

    /**
     * Constructor - Initializes the ChromeMainActivityHandler class.
     *
     * @param sessionsManager - An instance of SessionsManager to handle session-related operations.
     */
    constructor(sessionsManager: SessionsManager) {
        this.sessionsManager = sessionsManager;
        this.sessionsManager.startMainSession();  

        chrome.windows.onFocusChanged.addListener(this.handleWindowFocusChange.bind(this));
        chrome.windows.onRemoved.addListener(this.handleWindowRemoved.bind(this));
    }

    /**
     * handleWindowFocusChange - Handles window focus changes and starts a new MainSession when necessary.
     *
     * @param windowId - The ID of the currently focused window.
     */
    private handleWindowFocusChange(windowId: number): void {
        if (windowId !== chrome.windows.WINDOW_ID_NONE) {
            this.sessionsManager.startMainSession();
        }
    }

    /**
     * handleWindowRemoved - Handles window removal and ends the MainSession when all windows are closed.
     */
    private handleWindowRemoved(): void {
        chrome.windows.getAll({}, (windows) => {
            if (windows.length === 0) {
                this.sessionsManager.endMainSession();
            }
        });
    }
}
