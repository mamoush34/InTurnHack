const $document = $('document');

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action !== 'searchForEmbeddedBoards') {
        sendResponse({ status: `Incorrect message action '${request.action}' provided.` });
        return;
    }

    const respond = () => {
        const board = $(`iframe[src*='boards.greenhouse.io']`);
        const found = board.length > 0;
        sendResponse(found);
        found && window.open(board.first().attr('src'));
    };

    // send the response at the appopriate time (as soon as possible)
    if (document.readyState === 'complete') {
        respond();
    } else {
        $document.ready(respond);
    }
});