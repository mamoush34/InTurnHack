const router = new Map();

const handlers = [
    async function logApplicationEntry(_request, sendResponse) {
        fetch('http://localhost:1050/jobs', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                company: window.location.host.split(".")[1],
                jobTitle: $('h1').text(),
                url: window.location.href,
                appDate: new Date().toUTCString(),
                status: "Pending",
                datePosted: "",
                recruiterName: "",
                recruiterEmail: "",
                applicationWay: "Online",
                referralOptions: []
            })
        });
        sendResponse(true);
    },
    function openEmbeddedBoards({ user }, sendResponse) {
        if (user) {
            const board = $(`iframe[src*='boards.greenhouse.io']`);
            const found = board.length > 0;
            if (found) {
                const href = board.first().attr('src');
                const childReadyHandler = e => {
                    if (e.data.loaded === true) {
                        const a = document.createElement("a");
                        a.href = href;
                        const targetOrigin = `${a.protocol}//${a.host}`;
                        const autofill = { action: "autofillForUser", user };
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
    }
];

handlers.forEach(handler => router.set(`__${handler.name}`, handler));

$(document).ready(() => {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
        const handler = router.get(request.action);
        if (handler) {
            handler(request, sendResponse);
        } else {
            sendResponse({ status: `Incorrect message action '${request.action}' provided.` });
        }
    });
});