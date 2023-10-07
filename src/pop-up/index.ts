import StorageManager from '../common/services/StorageManager';
import MainSession from '../common/models/MainSession';
import TabSession from '../common/models/TabSession';


document.addEventListener('DOMContentLoaded', () => {
    StorageManager.getMainSessions(displayStats);
    initializeUIInteractions(); 
});

/**
 * Initialize UI Interactions - Setup the event listeners related to UI interactions.
 */
function initializeUIInteractions(): void {
    setupStatisticsButton();
}

/**
 * Setup Statistics Button - Add event listener to the statistics button to open the advanced statistics page.
 */
function setupStatisticsButton(): void {
    document.getElementById('viewStatistics')?.addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('src/dashboard/index.html') });
    });
}

/**
 * Calculate and return the duration of a tab session.
 *
 * @param tabSession - The tab session to calculate the duration for.
 * @returns - The duration of the tab session in seconds.
 */
function calculateTabSessionDuration(tabSession: TabSession): number {
    if (tabSession.startTimestamp && tabSession.endTimestamp) {
        return Math.floor((tabSession.endTimestamp - tabSession.startTimestamp) / 1000);
    }
    return 0;
}

/**
 * Display statistics, including total time spent and time spent per site.
 *
 * @param mainSessions - Array of MainSession objects to calculate and display statistics for.
 */
function displayStats(mainSessions: MainSession[]): void {
    let totalTime = 0;
    let timePerSite: {[key: string]: number} = {};

    mainSessions.forEach((mainSession: MainSession) => {
        mainSession.tabSessions.forEach((tabSession: TabSession) => {
            const duration = calculateTabSessionDuration(tabSession); // Using the new function
            totalTime += duration;
            timePerSite[tabSession.domain] = (timePerSite[tabSession.domain] || 0) + duration;
        });
    });

    // Display Total Time
    document.getElementById('total-time-spent')!.textContent = totalTime + ' sec';

    // Display Time per Site
    const timePerSiteList = document.getElementById('time-per-site-list')!;
    for (let domain in timePerSite) {
        let listItem = document.createElement('li');
        listItem.textContent = `${domain}: ${timePerSite[domain]} sec`;
        timePerSiteList.appendChild(listItem);
    }
}
