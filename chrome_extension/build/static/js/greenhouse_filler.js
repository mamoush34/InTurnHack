$(document).ready(() => {
    $(window).on("message", e => {
        console.log(e.originalEvent.data);
        const { action, user } = e.originalEvent.data;
        if (action && action === "autofillForUser" && user) {
            fetch('http://localhost:1050/inquireUser', {
                method: "POST",
                body: { user },
                json: true
            }).then(response => {
                response.json().then(({ first_name, last_name, email, phone }) => {
                    $("#first_name").val(first_name);
                    $("#last_name").val(last_name);
                    $("#email").val(email);
                    $("#phone").val(phone);
                });
            });
        }
    });
    window.opener.postMessage({ loaded: true }, "*");
});