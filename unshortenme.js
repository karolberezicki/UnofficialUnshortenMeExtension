function onClickHandler(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("selection " + info.selectionText);
    console.log("info: " + JSON.stringify(info));

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://unshorten.me/json/" + info.selectionText, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);

            if (resp.success) {
                chrome.tabs.query({
                    active: true
                }, tabs => {
                    let index = tabs[0].index;
                    chrome.tabs.create({
                        url: resp.resolved_url,
                        index: index + 1
                    });
                });
            }
        }
    }
    xhr.send();
};

chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.runtime.onInstalled.addListener(function() {
    var id = chrome.contextMenus.create({
        "title": "Unshorten.me %s",
        "contexts": ["selection"],
        "id": "contextselection"
    });
});
