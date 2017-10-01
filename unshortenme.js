function getUnshortenedUrl(shortenedUrl) {
    return new Promise((resolve, reject) => {
        fetch(`https://unshorten.me/json/${shortenedUrl}`)
            .then(response => {
                const result = response.json();
                resolve(result);
            })
            .catch(err => reject(err));
    })
}

function chromeOpenLinkInNextTab(url) {
    chrome.tabs.query({ active: true }, tabs => {
        let index = tabs[0].index;
        chrome.tabs.create({
            url: url,
            index: index + 1
        });
    });
}


function onClickHandler(info, tab) {
    getUnshortenedUrl(info.selectionText)
    .then(resp =>
    {
        console.log(resp);
        if (resp.success) chromeOpenLinkInNextTab(resp.resolved_url);
    })
    .catch(err => console.log(err));
};

chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.runtime.onInstalled.addListener(function() {
    var id = chrome.contextMenus.create({
        "title": "Unshorten.me %s",
        "contexts": ["selection"],
        "id": "contextselection"
    });
});