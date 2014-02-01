/*---------------------------------------------------------------------------
    Loading previously attempted progress from local storage
    -------------------------------------------------------------------------*/

window.onload=function() {

	$("#re-login").click(function() {
		localStorage.clear();
		userLogin();
	});

	if (isStorageAvailable()) {
		var isLoggedIn = localStorage.getItem("login-id");
		if (isLoggedIn === null) {
			userLogin();
		}

		$(".set-number").each(function() {
			var setNumber = $( this ).text();

			var goodPoints = localStorage.getItem(setNumber + "-good");
			var okayPoints = localStorage.getItem(setNumber + "-okay");
			var poorPoints = localStorage.getItem(setNumber + "-poor");

			if (goodPoints == null) {goodPoints = 0; localStorage.setItem(
				setNumber + "-good", 0);};
			if (okayPoints == null) {okayPoints = 0; localStorage.setItem(
				setNumber + "-okay", 0);};
			if (poorPoints == null) {poorPoints = 0; localStorage.setItem(
				setNumber + "-poor", 0);};

			$(this).next().children("#good-points").text(goodPoints);
			$(this).next().children("#okay-points").text(okayPoints);
			$(this).next().children("#poor-points").text(poorPoints);
		})
	}
	else {
		console.log("Local Storage is not supported");
	}
};

/*---------------------------------------------------------------------------
    Verifying availability of local storage
    -------------------------------------------------------------------------*/

function isStorageAvailable() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function userLogin() {
	$.magnificPopup.open({
		items: {
			src: $("#signup-modal"),
			type: 'inline'
		}
	});
	$("#registration-modal").click(function() {
		localStorage.setItem("login-id", $("#andrew-id").text());
		alert($("#andrew-id").val());
	});
}

