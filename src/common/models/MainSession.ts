import TabSession from './TabSession';

/**
 * MainSession - Represents a main browsing session including start time, end time, and associated TabSessions.
 */
export default class MainSession {
    startTimestamp: number;
    endTimestamp: number | null = null;
    tabSessions: TabSession[] = [];

    /**
     * Constructor - Initializes the MainSession with a starting timestamp.
     * 
     * @param startTimestamp - The timestamp representing the session's start time.
     */
    constructor(startTimestamp: number) {
        this.startTimestamp = startTimestamp;
    }

    /**
     * endSession - Marks the end of the session by recording the end timestamp.
     * 
     * @param endTimestamp - The timestamp representing the session's end time.
     */
    endSession(endTimestamp: number): void {
        this.endTimestamp = endTimestamp;
    }

    /**
     * addTabSession - Adds a new TabSession to the MainSession.
     * 
     * @param tabSession - The TabSession instance to be added.
     */
    addTabSession(tabSession: TabSession): void {
        this.tabSessions.push(tabSession);
    }
}
