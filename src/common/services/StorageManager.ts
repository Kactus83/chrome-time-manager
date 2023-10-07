import MainSession from '../models/MainSession';

/**
 * StorageManager - Handles the storage operations related to MainSession instances.
 */
export default class StorageManager {
    
    /**
     * saveMainSession - Saves a MainSession instance to local storage and logs the action.
     * 
     * @param mainSession - The MainSession instance to be saved.
     */
    static saveMainSession(mainSession: MainSession): void {
        chrome.storage.local.get(['mainSessions'], (result) => {
            let mainSessions: MainSession[] = result.mainSessions || [];
            mainSessions.push(mainSession);
            chrome.storage.local.set({mainSessions}, () => {
                console.log('MainSession saved:', mainSession);
            });
        });
    }

    /**
     * updateMainSession - Updates the last saved MainSession instance in local storage and logs the action or an error if no sessions are found.
     * 
     * @param updatedSession - The MainSession instance with updated data.
     */
    static updateMainSession(updatedSession: MainSession): void {
        chrome.storage.local.get(['mainSessions'], (result) => {
            let mainSessions: MainSession[] = result.mainSessions || [];
            if(mainSessions.length > 0) {
                mainSessions[mainSessions.length - 1] = updatedSession;
                chrome.storage.local.set({mainSessions}, () => {
                    console.log('MainSession updated:', updatedSession);
                });
            } else {
                console.error('No MainSessions available to update.');
            }
        });
    }

    /**
     * getMainSessions - Retrieves all MainSession instances from local storage and provides them to a callback function, logging an error if none are found.
     * 
     * @param callback - The function to be called with the retrieved MainSessions.
     */
    static getMainSessions(callback: (sessions: MainSession[]) => void): void {
        chrome.storage.local.get(['mainSessions'], (result) => {
            if (!result.mainSessions) {
                console.error('No MainSessions found.');
            }
            callback(result.mainSessions || []);
        });
    }
    
    /**
     * getLastMainSession - Retrieves the last MainSession instance from local storage and provides it to a callback function, or logs an error if none are found.
     * 
     * @returns Promise<MainSession | null> - A promise that resolves with the last MainSession or null if none are found.
     */
    static getLastMainSession(): Promise<MainSession | null> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['mainSessions'], (result) => {
                let mainSessions: MainSession[] = result.mainSessions || [];
                if (mainSessions.length > 0) {
                    // Retrieve the last MainSession and resolve the promise with it
                    resolve(mainSessions[mainSessions.length - 1]);
                } else {
                    // Log an error and resolve the promise with null
                    console.error('No MainSessions found.');
                    resolve(null);
                }
            });
        });
    }


    /**
     * clearMainSessions - Clears all MainSession instances from local storage and logs the action.
     */
    static clearMainSessions(): void {
        chrome.storage.local.set({mainSessions: []}, () => {
            console.log('All MainSessions cleared.');
        });
    }
}
