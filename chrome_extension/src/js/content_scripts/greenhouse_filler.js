$(document).ready(() => {
    window.addEventListener("message", async e => {
        const {
            action,
            user
        } = e.data;
        if (action && action === "autofillForUser" && user) {
            try {
                const response = await (await fetch('http://localhost:1050/inquireUser', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user
                    })
                })).text();
                if (!response) {
                    return alert("No user registered with companion web application, so autofill failed.");
                }
                const parsed = JSON.parse(response);
                Object.keys(classNames).forEach(field => $(`#${classNames[field]}`).val(parsed[field]));
            } catch (error) {
                console.warn("Unable complete autofill.", error);
            }
        }
    });
    window.opener.postMessage({
        loaded: true
    }, "*");
});

const classNames = {
    first_name: "first_name",
    last_name: "last_name",
    email: "email",
    phone: "phone",
    linked_in: "job_application_answers_attributes_0_text_value",
    website: "job_application_answers_attributes_1_text_value",
    university: "job_application_answers_attributes_3_text_value"
};