function logIn() {
	var username = $("#userUsername").val();
  var password = $("#userPassword").val();
  var loginType = $("#userLoginType").val();

	var params = {
		username: username,
    password: password,
    loginType: loginType
	};

	$.post("/login", params, function(result) {
		if (result && result.success) {
			$.post("/profile", result)
		} else {
			$("#errorMsg").text("Error logging in. Please try again.");
		}
	});
}

function logOut() {
	$.post("/logout", function(result) {
		if (result && result.success) {
			$("#status").text("Successfully logged out.");
		} else {
			$("#status").text("Error logging out.");
		}
	});
}