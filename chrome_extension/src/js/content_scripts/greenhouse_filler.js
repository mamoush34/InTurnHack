$('document').ready(async function () {
    const response = await fetch('http://localhost:1050/currentUser');
    const user = await response.json(); 
    $("#first_name").val(user.first_name);
    $("#last_name").val(user.last_name);
    $("#email").val(user.email);
    $("#phone").val(user.phone);
});