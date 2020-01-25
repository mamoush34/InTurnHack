const $document = $('document');

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action !== 'apply') {
        sendResponse({ status: `Incorrect message action '${request.action}' provided.` });
        return;
    }
    const respond = () => {
        const board = $(`iframe[src*='boards.greenhouse.io']`);
        const found = board.length;
        if (found) {
            window.open(board.first().attr('src'));
        }
        sendResponse(found ? 'Successfully opened job board.' : 'No embedded greenhouse.io content was found.');
    };
    if (document.readyState === 'complete') {
        respond();
        return;
    }
    $document.ready(respond);
});