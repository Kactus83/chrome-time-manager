/**
 * TabSession DTO - Represents an individual tab session containing domain and timestamps.
 */
export default class TabSession {
    domain: string;
    startTimestamp: number;
    endTimestamp: number | null = null;

    /**
     * Constructor - Initializes the TabSessionDTO with domain and start timestamp.
     * 
     * @param domain - The domain associated with the tab session.
     * @param startTimestamp - The timestamp representing the tab session's start time.
     */
    constructor(domain: string, startTimestamp: number) {
        this.domain = domain;
        this.startTimestamp = startTimestamp;
    }
}

