import { Message, MessageType } from './model/Message';

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
        deactivatePageAction(tabId);
    }
});

chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender) => {
    const tabId = sender.tab?.id;

    switch (message.type) {
        case MessageType.ACTIVATE_BROWSER_ACTION: {
            if (tabId === undefined) return;
            activatePageAction(tabId);
            break;
        }
    }
});

chrome.pageAction.onClicked.addListener((tab: chrome.tabs.Tab) => {
    if (tab.id === undefined) return;
    chrome.tabs.sendMessage(tab.id, { type: MessageType.TOGGLE_PIP });
});

function activatePageAction(tabId: number) {
    chrome.pageAction.show(tabId);
}

function deactivatePageAction(tabId: number) {
    chrome.pageAction.hide(tabId);
}
