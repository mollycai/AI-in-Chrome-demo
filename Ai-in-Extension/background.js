chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Side panel setup failed:', error));

chrome.tabs.onActivated.addListener((activeInfo) => {
  showSummary(activeInfo.tabId);
});
chrome.tabs.onUpdated.addListener(async (tabId) => {
  showSummary(tabId);
});
chrome.runtime.onMessage.addListener((message) => {
  console.log('message', message)
  if (message.type === 'selected-content') {
    chrome.storage.session.set({
      pageContent: message.content
    });
  }
});

async function showSummary(tabId) {
  const tab = await chrome.tabs.get(tabId);
  if (!tab.url?.startsWith('http')) {
    return;
  }
  const injection = await chrome.scripting.executeScript({
    target: { tabId },
    files: ['scripts/extract-content.js']
  }).catch(e => {
    console.error('inject script failed:', e);
  });
  console.log(injection)
  await chrome.storage.session.set({ pageContent: injection[0].result });
}