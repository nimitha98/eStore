$(function () {

    $(document).ready(function () {

        $("#msg").hide();

    });
    $("#signup").on("click", function (event) {
        event.preventDefault();
        var username = $("#username").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var cpassword = $("#password2").val();
        var emailRegex = /^[A-Za-z0-9.]+@[A-Z0-9a-z.-]+\.[A-Za-z]{2,}$/;
        var passwordRegex = /\d/;
        $("#msg").show();
        if (!username || !email || !password || !cpassword) {
            $("#msg").show().html("All fields are required.");
        } else if (!email.match(emailRegex)) {
            $("#msg").show().html("Please enter a valid email");
        } else if (password.length < 6) {
            $("#msg").show().html("Password should be atleast 6chars");
        } else if (!password.match(passwordRegex)) {
            $("#msg").show().html("Password should contain atleast one number");
        } else if (cpassword != password) {
            $("#msg").show().html("Passowrds should match.");
        }
        else {
            $.ajax({
                url: "/signup",
                method: "POST",
                data: {
                    username: username,
                    email: email,
                    password: password,
                    cpassword: cpassword,
                },
            }).done(function (data) {
                if (data) {
                    // console.log(data.success);
                    if (!data.success) {
                        $("#msg")
                            .removeClass("alert-success")
                            .addClass("alert-danger")
                            .html(data.message)
                            .show();
                    } else {
                        $("#msg")
                            .removeClass("alert-danger")
                            .addClass("alert-success")
                            .html(data.message)
                            .show();
                    }
                }
            });
        }
    });
});
