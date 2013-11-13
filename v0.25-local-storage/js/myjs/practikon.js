//Defining exists function that returns whether an element exists or not
jQuery.fn.exists = function(){
    return this.length>0;
}

var responseSubmitted = false;
var setNumber = null;

setNumber = $("#activity-set-number").text();

var goodPoints = localStorage.getItem(setNumber + "-good");
var okayPoints = localStorage.getItem(setNumber + "-okay");
var poorPoints = localStorage.getItem(setNumber + "-poor");

if (goodPoints == undefined) {goodPoints = 0; localStorage.setItem(setNumber + "-good", "0");};
if (okayPoints == undefined) {okayPoints = 0; localStorage.setItem(setNumber + "-okay", "0");};
if (poorPoints == undefined) {poorPoints = 0; localStorage.setItem(setNumber + "-poor", "0");};

$("#good-points").text(goodPoints);
$("#okay-points").text(okayPoints);
$("#poor-points").text(poorPoints);

function submitResponse() {
    if (!responseSubmitted){
        $("#scope-modal-message > span").html($("#next-activity").html());
        $(".problematic").addClass("submitted");
        $(".non-problematic").addClass("context-finalized");
        $("#slider").html("<div class=\"choice no-slide swipe-wrap\">"
            + "best response:</br> " + $(".choice.good-option").text() + "</div>");

        if( $(".problematic").hasClass("poor-option")){
            var poorPoints = parseInt(localStorage.getItem(setNumber + "-poor")) + 1;
            $("#poor-points").text(poorPoints);
            localStorage.setItem(setNumber + "-poor", poorPoints);
        } 
        else if( $(".problematic").hasClass("okay-option")){
            var okayPoints = parseInt(localStorage.getItem(setNumber + "-okay")) + 1;
            $("#okay-points").text(okayPoints);
            localStorage.setItem(setNumber + "-okay", okayPoints);
        }  else {
            var goodPoints = parseInt(localStorage.getItem(setNumber + "-good")) + 1;
            $("#good-points").text(goodPoints);
            localStorage.setItem(setNumber + "-good", goodPoints);
        }
    }
    responseSubmitted = true;
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