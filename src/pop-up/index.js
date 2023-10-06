document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['sessions'], (result) => {
      const sessions = result.sessions || [];
      displayStats(sessions);
  });
});

function displayStats(sessions) {
  let totalTime = 0;
  let timePerSite = {};

  sessions.forEach(session => {
      totalTime += session.duration;
      timePerSite[session.domain] = (timePerSite[session.domain] || 0) + session.duration;
  });

  // Display Total Time
  document.getElementById('total-time-spent').textContent = totalTime + ' sec';

  // Display Time per Site
  const timePerSiteList = document.getElementById('time-per-site-list');
  for (let domain in timePerSite) {
      let listItem = document.createElement('li');
      listItem.textContent = `${domain}: ${timePerSite[domain]} sec`;
      timePerSiteList.appendChild(listItem);
  }
}
