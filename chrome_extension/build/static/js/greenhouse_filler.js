chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
    console.log("HEY!", request);
    if (request.action === "inquireUser") {
        const response = await fetch('http://localhost:1050/inquireUser', {
            method: "POST",
            body: { email: request.email },
            json: true
        });
        const { first_name, last_name, email, phone } = await response.json(); 
        $("#first_name").val(first_name);
        $("#last_name").val(last_name);
        $("#email").val(email);
        $("#phone").val(phone);
        sendResponse(true);
    }
});