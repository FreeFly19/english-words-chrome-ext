function onClickHandler(info, tab) {
    if (info.menuItemId !== "selection-context") return;

    console.log(info.selectionText);
    console.log(this.document.body);

    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        "title": "Translate",
        "contexts": ["selection"],
        "id": "selection-context"
    });
});

