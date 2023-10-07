import SessionsManager from './services/SessionsManager';
import ChromeMainActivityHandler from './services/ChromeMainActivityHandler';
import ChromeTabActivityHandler from './services/ChromeTabActivityHandler';

/**
 * Entry Point - Instantiates session management and activates handlers for Chrome window and tab activities.
 */
class Background {
    private sessionsManager: SessionsManager;
    private chromeMainActivityHandler: ChromeMainActivityHandler;
    private chromeTabActivityHandler: ChromeTabActivityHandler;

    /**
     * Constructor - Initializes the EntryPoint class.
     */
    constructor() {
        this.sessionsManager = new SessionsManager();
        this.chromeMainActivityHandler = new ChromeMainActivityHandler(this.sessionsManager);
        this.chromeTabActivityHandler = new ChromeTabActivityHandler(this.sessionsManager);
    }
}

// Initialize the application.
new Background();
