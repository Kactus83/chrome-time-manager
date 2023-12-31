import MainSession from '../../common/models/MainSession';
import TabSession from '../../common/models/TabSession';
import StorageManager from '../../common/services/StorageManager';

/**
 * SessionsManager - Manages the creation, modification, and interactions with browsing sessions.
 */
export default class SessionsManager {
    currentMainSession: MainSession | null = null;

    /**
     * verifyAndCloseLastMainSession - Checks if the last MainSession in storage was ended correctly and
     * corrects it if not by setting its endTimestamp to the last endTimestamp of its TabSessions.
     */
    async verifyAndCloseLastMainSession(): Promise<void> {
        try {
            // Get the last MainSession from storage
            const lastMainSession = await StorageManager.getLastMainSession();
            
            if (lastMainSession && !lastMainSession.endTimestamp) {
                console.log('Last MainSession was not ended correctly. Correcting...');
                
                // Find the latest endTimestamp from its TabSessions
                const latestTabSessionEndTimestamp = lastMainSession.tabSessions.reduce((latest, session) => {
                    // If session.endTimestamp is null, keep the existing latest timestamp
                    return session.endTimestamp 
                        ? Math.max(latest, session.endTimestamp)
                        : latest;
                }, lastMainSession.startTimestamp);  // Start with the startTimestamp of the MainSession
                
                // Use the latest endTimestamp found, or the MainSession's startTimestamp if none was found
                lastMainSession.endTimestamp = latestTabSessionEndTimestamp;
                
                // Update the corrected MainSession back to storage
                await StorageManager.updateMainSession(lastMainSession);
            }
        } catch (error) {
            console.error('Error verifying last MainSession:', error);
        }
    }

    /**
     * startMainSession - Starts a new MainSession, logs its creation, saves it using StorageManager.
     */
    startMainSession(): void {
        // If there's an active MainSession, end it.
        if (this.currentMainSession) {
            this.endMainSession();
        }
        
        console.log('Starting new MainSession...');
        this.verifyAndCloseLastMainSession();
        this.currentMainSession = new MainSession(Date.now());
        StorageManager.saveMainSession(this.currentMainSession);
    }

    /**
     * endMainSession - Ends the current MainSession by recording the end timestamp and updating it using StorageManager.
     */
    endMainSession(): void {
        if (!this.currentMainSession) {
            console.log('No MainSession to end.');
            return;
        }

        console.log('Ending MainSession...');
        this.currentMainSession.endTimestamp = Date.now();
        StorageManager.updateMainSession(this.currentMainSession);
        this.currentMainSession = null;
    }

    /**
     * startTabSession - Starts a new TabSession associated with the current MainSession and logs its creation.
     * 
     * @param domain - The domain associated with the tab session.
     */
    startTabSession(domain: string): void {
        if (!this.currentMainSession) {
            console.log('No MainSession active. Cannot start TabSession.');
            return;
        }

        console.log('Starting new TabSession for domain:', domain);
        const tabSession = new TabSession(domain, Date.now());
        this.currentMainSession.tabSessions.push(tabSession);
        StorageManager.updateMainSession(this.currentMainSession);
    }

    /**
     * endTabSession - Ends the latest TabSession of the current MainSession by recording the end timestamp.
     */
    endTabSession(): void {
        if (!this.currentMainSession) {
            console.log('No MainSession active. Cannot end TabSession.');
            return;
        }

        // Check if there are any tab sessions to end
        if (this.currentMainSession.tabSessions.length === 0) {
            console.log('No TabSessions found. Nothing to end.');
            return;
        }

        // Get the latest TabSession
        const latestTabSession = this.currentMainSession.tabSessions[
            this.currentMainSession.tabSessions.length - 1
        ];

        // Ensure that the session is still ongoing (i.e., no endTimestamp)
        if (!latestTabSession.endTimestamp) {
            console.log('Ending TabSession for domain:', latestTabSession.domain);
            latestTabSession.endTimestamp = Date.now();
            // Update the MainSession in storage
            StorageManager.updateMainSession(this.currentMainSession);
        } else {
            console.log('Warning: Attempted to end a TabSession that was already ended. Domain:', latestTabSession.domain);
        }
    }

}
