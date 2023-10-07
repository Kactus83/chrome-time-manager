import StorageManager from '../common/services/StorageManager';
import MainSession from '../common/models/MainSession';
import TabSession from '../common/models/TabSession';

document.addEventListener('DOMContentLoaded', () => {
    StorageManager.getMainSessions(displayStats);
});

function displayStats(mainSessions: MainSession[]): void {
    displayTotalTime(mainSessions);
    displayDailyAverageTime(mainSessions);
    displayTopSites(mainSessions);
}

function displayTotalTime(mainSessions: MainSession[]): void {
    let totalTime = 0;
    
    mainSessions.forEach(session => {
        session.tabSessions.forEach(tabSession => {
            if (tabSession.startTimestamp && tabSession.endTimestamp) {
                totalTime += (tabSession.endTimestamp - tabSession.startTimestamp);
            }
        });
    });
    
    document.getElementById('total-time')!.textContent = (totalTime / 1000).toFixed(2) + ' sec';
}

function displayDailyAverageTime(mainSessions: MainSession[]): void {
    // Note: This assumes that your MainSession objects are sorted by date.
    // If this is not the case, additional sorting logic may be required.
    
    let totalDays = 0;
    let totalTime = 0;

    mainSessions.forEach(session => {
        session.tabSessions.forEach(tabSession => {
            if (tabSession.startTimestamp && tabSession.endTimestamp) {
                totalTime += (tabSession.endTimestamp - tabSession.startTimestamp);
            }
        });
    });
    
    if (mainSessions.length > 0) {
        const firstSessionStart = mainSessions[0].tabSessions[0]?.startTimestamp;
        const lastSessionEnd = mainSessions[mainSessions.length - 1].tabSessions[0]?.endTimestamp;
        
        if (firstSessionStart && lastSessionEnd) {
            totalDays = (lastSessionEnd - firstSessionStart) / (1000 * 60 * 60 * 24);
        }
    }
    
    const averageTimePerDay = totalTime / totalDays;
    
    document.getElementById('daily-average-time')!.textContent = (averageTimePerDay / 1000).toFixed(2) + ' sec/day';
}

function displayTopSites(mainSessions: MainSession[]): void {
    let siteTime: {[key: string]: number} = {};
    
    mainSessions.forEach(session => {
        session.tabSessions.forEach(tabSession => {
            const duration = tabSession.endTimestamp && tabSession.startTimestamp ? (tabSession.endTimestamp - tabSession.startTimestamp) : 0;
            siteTime[tabSession.domain] = (siteTime[tabSession.domain] || 0) + duration;
        });
    });
    
    const topSites = Object.entries(siteTime)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const ul = document.getElementById('most-visited-sites-list')!;
    ul.innerHTML = "";
    topSites.forEach(site => {
        let li = document.createElement('li');
        li.textContent = `${site[0]}: ${(site[1] / 1000).toFixed(2)} sec`;
        ul.appendChild(li);
    });
}
