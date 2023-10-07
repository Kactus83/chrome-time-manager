import TabSession from './TabSession';

/**
 * MainSession DTO - Represents a main browsing session including start time, end time, and associated TabSessions.
 */
export default class MainSession {
    startTimestamp: number;
    endTimestamp: number | null = null;
    tabSessions: TabSession[] = [];

    /**
     * Constructor - Initializes the MainSessionDTO with a starting timestamp.
     * 
     * @param startTimestamp - The timestamp representing the session's start time.
     */
    constructor(startTimestamp: number) {
        this.startTimestamp = startTimestamp;
    }
}
