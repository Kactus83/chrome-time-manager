let currentSession = {
  domain: null, 
  startTimestamp: null,
  endTimestamp: null,
  getDuration: function() {
      if (this.startTimestamp && this.endTimestamp) {
          return Math.floor((this.endTimestamp - this.startTimestamp) / 1000); 
      }
      return 0;
  }
};

chrome.tabs.onActivated.addListener(activeInfo => {
  endCurrentSession();
  startNewSession(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && currentSession.domain) {
      endCurrentSession();
      startNewSession(tabId);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
      endCurrentSession();
  } else {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
          if (tabs[0]) {
              endCurrentSession();
              startNewSession(tabs[0].id);
          }
      });
  }
});

function startNewSession(tabId) {
  chrome.tabs.get(tabId, (tab) => {
      currentSession.domain = new URL(tab.url).hostname;
      currentSession.startTimestamp = new Date().getTime();
      currentSession.endTimestamp = null;
      console.log('New session started:', currentSession);
  });
}

function endCurrentSession() {
  if (currentSession.domain) {
      currentSession.endTimestamp = new Date().getTime();
      console.log('Session ended:', currentSession);
      
      const duration = currentSession.getDuration();
      console.log('Duration:', duration, 'seconds');
      
      // Save and Reset session
      saveSession(currentSession);
      currentSession.domain = null;
      currentSession.startTimestamp = null;
      currentSession.endTimestamp = null;
  }
}

function saveSession(session) {
  console.log(session);
}
