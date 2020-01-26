const handlers = new Map([
    [openEmbeddedBoards.name, openEmbeddedBoards],
    [logApplicationEntry.name, logApplicationEntry]
]);

$(document).ready(() => {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
        const handler = handlers.get(request.action);
        if (handler) {
            handler(request, sendResponse);
        } else {
            sendResponse({ status: `Incorrect message action '${request.action}' provided.` });
        }
    });
});

async function logApplicationEntry(request, sendResponse) {
    
}

function openEmbeddedBoards(request, sendResponse) {
    const board = $(`iframe[src*='boards.greenhouse.io']`);
    const found = board.length > 0;
    if (found) {
        const href = board.first().attr('src');
        const childReadyHandler = e => {
            if (e.data.loaded === true) {
                const a = document.createElement("a");
                a.href = href;
                const targetOrigin = `${a.protocol}//${a.host}`;
                const autofill = {
                    action: "autofillForUser",
                    user: request.user
                };
                child.postMessage(autofill, targetOrigin);
                window.removeEventListener("message", childReadyHandler);
                sendResponse(true);
            }
        };
        window.addEventListener("message", childReadyHandler);
        const child = window.open(href);
    } else {
        sendResponse(false);
    }
}