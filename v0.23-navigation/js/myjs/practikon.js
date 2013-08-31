//Retrieve Score from local storage and set the appropriate HTML div to that score

function submitResponse() {
   $("#scope-modal-message > span").html("<a href=\"./parallelism2.0.html\">try another challenge.</a>");
    $(".problematic").addClass("submitted");
    $(".non-problematic").addClass("context-finalized");
   $("#slider").html("<div class=\"choice no-slide swipe-wrap\">best response:</br> " + $(".good-option").text() + "</div>");

    if( $(".problematic").hasClass("poor-option")){
        var poorPoints = 1;
        $("#poor-points").text(poorPoints);
        //Increment poor score by 1
    } 
    else if( $(".problematic").hasClass("okay-option")){
        var okayPoints = 1;
        $("#okay-points").text(okayPoints);
        //Increment okay score by 1

    }  else {
        var goodPoints = 1;
        $("#good-points").text(goodPoints);
        //Increment good score by 1
    }
}

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