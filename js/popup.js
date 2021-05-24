// Global variable to store the clipboard content 
var clipboard_text = '';
var local_storage = '';

// Build the popup view
chrome.storage.local.get(['links'], function (result) {
    var html = '';
    local_storage = result['links'];

    for( var key in local_storage) {
        html += '<div class="popup-row">' + local_storage[key]["title"] + " " + local_storage[key]["progress"]+ '</div>';
    }

    document.getElementById("popup-list").innerHTML = html;
});
