//verifying that local storage is supported by the browser
if (isStorageAvailable()) {
	$(".set-number").each(function() {
		var setNumber = $( this ).text();

		var goodPoints = localStorage.getItem(setNumber + "-good");
		var okayPoints = localStorage.getItem(setNumber + "-okay");
		var poorPoints = localStorage.getItem(setNumber + "-poor");

		if (goodPoints == null) {goodPoints = 0; localStorage.setItem(setNumber + "-good", 0);};
		if (okayPoints == null) {okayPoints = 0; localStorage.setItem(setNumber + "-okay", 0);};
		if (poorPoints == null) {poorPoints = 0; localStorage.setItem(setNumber + "-poor", 0);};

		$(this).next().children("#good-points").text(goodPoints);
		$(this).next().children("#okay-points").text(okayPoints);
		$(this).next().children("#poor-points").text(poorPoints);
	})
}

//function to verify if browser supports local storage
function isStorageAvailable() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

