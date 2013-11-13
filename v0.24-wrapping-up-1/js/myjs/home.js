//Set Initial Activity Number to 0
//Set Initial Good Score to 0
//Set Initial Okay Score to 0
//Set Initial Poor Score to 0

if (isStorageAvailable()) {
	alert("Storage");
}


function isStorageAvailable() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

