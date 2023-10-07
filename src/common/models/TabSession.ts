/**
 * TabSession - Represents an individual tab session containing domain and timestamps.
 */
export default class TabSession {
    domain: string;
    startTimestamp: number;
    endTimestamp: number | null = null;

    /**
     * Constructor - Initializes the TabSession with domain and start timestamp.
     * 
     * @param domain - The domain associated with the tab session.
     * @param startTimestamp - The timestamp representing the tab session's start time.
     */
    constructor(domain: string, startTimestamp: number) {
        this.domain = domain;
        this.startTimestamp = startTimestamp;
    }

    /**
     * endSession - Marks the end of the tab session by recording the end timestamp.
     * 
     * @param endTimestamp - The timestamp representing the tab session's end time.
     */
    endSession(endTimestamp: number): void {
        this.endTimestamp = endTimestamp;
    }
}
