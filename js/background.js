// Initial Link Arrary
chrome.storage.local.set({ 'links': {} }, function () {
    console.log('Initial Link Arrary');
});

chrome.storage.local.set({ 'fcEnabled': false }, function () {
    console.log('Initial fcEnabled');
});

// Set up a listener for closing the tab, not used in the project
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     if (message.closeThis) chrome.tabs.remove(sender.tab.id);
// });
