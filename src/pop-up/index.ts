import StorageManager from '../common/services/StorageManager';
import MainSession from '../common/models/MainSession';
import TabSession from '../common/models/TabSession';

document.addEventListener('DOMContentLoaded', () => {
    StorageManager.getMainSessions(displayStats);
});

function displayStats(mainSessions: MainSession[]): void {
    let totalTime = 0;
    let timePerSite: {[key: string]: number} = {};

    mainSessions.forEach((mainSession: MainSession) => {
        mainSession.tabSessions.forEach((tabSession: TabSession) => {
            totalTime += tabSession.getDuration();
            timePerSite[tabSession.domain] = (timePerSite[tabSession.domain] || 0) + tabSession.getDuration();
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
