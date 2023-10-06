/**
 * =====================================
 * SECTION 1: Session Object & Management
 * =====================================
 */
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

function startNewSession(tabId) {
  chrome.tabs.get(tabId, (tab) => {
      currentSession.domain = new URL(tab.url).hostname;
      currentSession.startTimestamp = new Date().getTime();
      currentSession.endTimestamp = null;
  });
}

function endCurrentSession() {
  if (currentSession.domain) {
      currentSession.endTimestamp = new Date().getTime();
      
      const duration = currentSession.getDuration();
      
      // Save and Reset session
      saveSession(currentSession);
      currentSession.domain = null;
      currentSession.startTimestamp = null;
      currentSession.endTimestamp = null;
  }
}

/**
 * =====================
 * SECTION 2: Data Storage
 * =====================
 */
function saveSession(session) {
  session.duration = session.getDuration();
  session.date = new Date(session.startTimestamp).toLocaleDateString();

  chrome.storage.local.get(['sessions'], (result) => {
    let sessions = result.sessions || [];
    sessions.push(session);
    chrome.storage.local.set({sessions}, () => {
      console.log('Session saved:', session);
    });
  });
}

/**
 * ========================================
 * SECTION 3: Event Listeners and Triggers
 * ========================================
 */
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
