const colors = {
    autofilled: "palegreen",
    unfilled_optional: "lightskyblue",
    unfilled_required: "yellow"
};

$(document).ready(() => {

    window.addEventListener("message", e => {
        const action = e.data.action;
        if (!action) {
            return;
        }
        switch (action) {
            case "autofillForUser":
                executeAutofill(e.data.user);
                break;
        }
    });

    window.opener.postMessage({
        loaded: true
    }, "*");

});

async function executeAutofill(user) {
    if (!user) {
        return;
    }
    try {
        const inputs = [];
        $(".field").each(function () {
            (function visit(element) {
                if (element.is(":text")) {
                    let label;
                    const labelSiblings = element.siblings().filter("label");
                    if (labelSiblings.length) {
                        label = $(labelSiblings.get(0)).text();
                    } else {
                        const parent = element.parent();
                        if (parent.is("label")) {
                            label = parent.text();
                        }
                    }
                    if (label) {
                        const required = label.includes("*");
                        label = label.toLowerCase().replace(/[\?\*]+/, "").replace(/\s+$/, "").replace(/\s+/g, "_");
                        inputs.push({
                            element,
                            label,
                            required
                        });
                    }
                } else {
                    element.children().each(function () {
                        visit($(this));
                    });
                }
            })($(this));
        });
        const userInformation = JSON.parse(await (await fetch('http://localhost:1050/inquireUser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user
            })
        })).text());
        if (!userInformation) {
            return alert("No user registered with companion web application, so autofill failed.");
        }

        // execute autofill for standard text inputs
        inputs.forEach(({
            element,
            label,
            required
        }) => {
            const value = userInformation[label];
            if (value) {
                element.val(value);
                element.css("background-color", colors.autofilled);
            } else {
                element.css("background-color", required ? colors.unfilled_required : colors.unfilled_optional); // indicates to user that no stored value was found
            }
        });
        $("select").css("background-color", colors.unfilled_optional);
        $(".attach-or-paste").each(function () {
            const target = $(this);
            const required = target.siblings().filter("label").children().filter("span.asterisk").length > 0;
            target.css("background-color", required ? colors.unfilled_required : colors.unfilled_optional);
        });

        const {
            attributes
        } = userInformation;
        if (attributes === false) {
            return;
        }

        let {
            gender,
            hispanic_latino,
            race,
            veteran,
            disabled
        } = attributes;

        let options, matched;

        const autofillSelect = (idContents, target, contains = false) => {
            const select = $(`select[id*=${idContents}]`);
            select.css("background-color", colors.autofilled);
            options = select.children().filter("option");
            matched = options.filter(function () {
                const text = $(this).text().toLowerCase();
                return contains ? text.includes(target) : text === target;
            });
            (matched.length ? matched : options.filter(":last-child")).prop("selected", true);
        };

        autofillSelect("gender", gender);
        autofillSelect("hispanic", hispanic_latino ? "yes" : "no");
        if (!hispanic_latino) {
            $("*[id*=race_dropdown]").css("display", "block");
            autofillSelect("race", race);
        }
        autofillSelect("veteran", veteran ? "identify" : "not", true);
        autofillSelect("disability", disabled ? "yes" : "no", true);

    } catch (error) {
        console.warn("Unable complete autofill.", error);
    }
}