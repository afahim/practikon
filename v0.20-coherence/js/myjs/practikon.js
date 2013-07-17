var scopeDismissed = true;

document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 13: //Enter
        	submitResponse();
        	break;
        case 37: //Left Key
        	if (!scopeDismissed)
        	{
        		window.mySwipe.prev();
        	}
            break;
        case 39: //Right Key
        	if (!scopeDismissed)
        	{
        		window.mySwipe.next();
        	}
            break;
    }
};

function submitResponse() {
	$(".problematic").addClass("submitted");
    $(".non-problematic").addClass("context-finalized");
}