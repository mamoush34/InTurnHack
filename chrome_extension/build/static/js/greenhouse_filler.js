$(document).ready(() => {
    const fields = ["first_name", "last_name", "email", "phone"];
    $(window).on("message", async e => {
        const { action, user } = e.originalEvent.data;
        if (action && action === "autofillForUser" && user) {
            const response = await (await fetch('http://localhost:1050/inquireUser', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user })
            })).json();
            fields.forEach(field => $(`#${field}`).val(response[field]));
        }
    });
    window.opener.postMessage({ loaded: true }, "*");
});