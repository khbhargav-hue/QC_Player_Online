chrome.action.onClicked.addListener((tab) => {
  let playerUrl = chrome.runtime.getURL("player.html");

  if (tab && tab.url && /drive\.google\.com\/file\/d\//.test(tab.url)) {
    playerUrl += `?driveUrl=${encodeURIComponent(tab.url)}`;
  }

  chrome.tabs.create({ url: playerUrl });
});
