$(document).ready(function(){

	var selectedSegment = null;

	$(document).click(function(event){
		var thisClass = $(event.target).attr('class');
		var thisID = $(event.target).attr('id');

		//alert(thisClass + ":" + thisID );
		
		if (thisClass == undefined)
		{
			$(".selected > .segment-delete").fadeOut(20);
			var optionsID = selectedSegment.next().attr('id');
			//document.getElementById(optionsID).innerHTML = "";
			$("#" + optionsID).append("<ol class=\"option\"></ol>");
			$(".choices").each(function(){
				$("#" + optionsID).append($(this).html());
			});
			$(".scope-nav").hide();
			$('#scope-modal').slideUp(600);
			selectedSegment.removeClass("selected");
			selectedSegment = null;
		}
		//This Code is called when "selectable" segment is clicked on the activity.
		//It clears up the currently existent content.
		//ToDo: Remove duplicate code
		else if (thisClass === "segment")
		{
			$(".choices").remove();
			var optionsID = $(event.target).next().attr('id');
			selectedSegment = $(event.target);
			$(".segment").removeClass("selected");
			selectedSegment.addClass("selected");
			$(".selected > .segment-delete").fadeOut(0);
			$(".selected > .segment-delete").fadeIn(600, function(){
				$('#scope-modal').slideDown(600);
				$(".scope-nav").show();
				$("#scope-modal").append("<div id=\"slider\" class=\"swipe no-slide\"></div>");
				$("#slider").append("<ol class=\"swipe-wrap choices no-slide\"></ol>");
				$("#" + optionsID + " div").each(function(){
					$(".choices").append($(this).clone());
				});
				window.mySwipe = Swipe(document.getElementById('slider'));
			});
			
		}

		//Replacing existing text with the choice that was clicked.
		//Making existing text one of the available choices for the segment
		//ToDo: We can get rid of jQuery UI and just rely on opacity to fade in out stuff without
		//having to change color to grey
		//ToDo: Instead of having a "..." in every segment div, just make one generic one and always keep
		//it in scope mode.
		else if (thisClass.indexOf("choice") !== -1)
		{
			var originalText = selectedSegment.html();
			var selectedChoice = $(event.target).html();

			$(".segment, .non-actionable").css("opacity", "0.5");
			selectedSegment.css("opacity", "1");
			selectedSegment.fadeOut(200, function(){
				$(this).html(selectedChoice).hide();
				$(this).css("opacity", "1");
				$(this).show(0, function(){
					$( ".segment, .non-actionable" ).animate({
						color: "#FFFFFF",
						opacity: "1",
					}, 3000 );
				});
			});
			$(event.target).fadeOut("slow", function(){
				$(this).html(originalText).hide();
				$(this).fadeIn("slow");
			});
		}

		//Not dismissing scope mode if clicked on by the user
		// ToDo: Change global clicks to onClicks to avoid overhead of going through this list sequentially
		else if (thisClass.indexOf("no-slide") !== -1 || thisClass.indexOf("segment-delete") !== -1)
		{

		}

		//Dismissing scope modal - in case user clicks anywhere but selectable text
		else
		{	
			$(".selected > .segment-delete").fadeOut(20);
			var optionsID = selectedSegment.next().attr('id');
			//document.getElementById(optionsID).innerHTML = "";
			$("#" + optionsID).append("<ol class=\"option\"></ol>");
			$(".choices").each(function(){
				$("#" + optionsID).append($(this).html());
			});
			$(".scope-nav").hide();
			$('#scope-modal').slideUp(600);
			selectedSegment.removeClass("selected");
			selectedSegment = null;
		}
	});

});



function swipeLeft(){
	window.mySwipe.prev();
}

function swipeRight(){
	window.mySwipe.next();
}

function deleteSegment(){
	var originalText = $( ".selected" ).html();
	$(".selected").html("...")
	$(".swipe-wrap > .empty-char").html(originalText);
}

function deleteToDelete(){
	var originalText = $( ".to-delete" ).html();
	$(".to-delete").html("...")
	//$(".swipe-wrap > .empty-char").html(originalText);
}


//$("#position").text("1");

var obj = document.getElementsByClassName('segment');

var touchStart = null;
var touchMax = null;

/*document.addEventListener('touchstart', function(event) {
  // If there's exactly one finger inside this element
  if (event.targetTouches.length == 1) {
    var touch = event.targetTouches[0];
    touchStart = touch.pageX;
    // Place element where the finger is
    //document.style.left = touch.pageX + 'px';
    //document.style.top = touch.pageY + 'px';
    document.getElementById("position").innerHTML = touch.pageX + " : " + touch.pageY;
  }
}, false);*/


//Left is 0, Right is 1
var touchPositions = null;
var touchDirections = null;
var currentDirection = null; 
var previousX = null;

var allSegments = document.getElementsByClassName("segment");

for (segment = 0; segment < allSegments.length; segment++)
{
	allSegments[segment].addEventListener('touchstart', function(event) {
		event.preventDefault();
		// If there's exactly one finger inside this element
		if (event.targetTouches.length == 1) {
			touchPositions = new Array();
			touchDirections = new Array();
			var touch = event.targetTouches[0];
		}
	}, false);

	allSegments[segment].addEventListener('touchmove', function(event) {
		// If there's exactly one finger inside this element
		if (event.targetTouches.length == 1) {
		var touch = event.targetTouches[0];
		touchPositions.push(touch.pageX);
		}
	}, false);

	allSegments[segment].addEventListener('touchend', function(event) {
	// If there's exactly one finger inside this element
	if (touchPositions != null && touchPositions.length > 1 ) {
  		previousX = touchPositions[0];
  		//Assuming all consecurive touchPosition elements are different
  		if (touchPositions[1] > touchPositions[0]){
  			currentDirection = 1;
  		}
  		else {
  			currentDirection = 0;
  		}

  		touchDirections.push(currentDirection);

  		for(i = 2; i < touchPositions.length; i++ ) {
  			if (touchPositions[i] > touchPositions[i-1] && touchDirections[touchDirections.length - 1] != 1){
  				touchDirections.push(1);
  			} 
  			else if (touchPositions[i] < touchPositions[i-1] && touchDirections[touchDirections.length - 1] != 0) {
  				touchDirections.push(0);
  				
  			}
  		}

  		var variationCount = 0;
  		//alert(touchDirections + " length: " + touchDirections.length);
  		if (touchDirections.length > 2) {
  			for (i = 1; i < 3; i++) {
  				if (touchDirections[i] !== touchDirections[i-1]) {
  					variationCount++;
  				}
  			}

  			if (variationCount > 1) {
  				originalClass = event.target.className;
  				event.target.className = originalClass + " to-delete";
  				deleteToDelete();
  				event.target.className = originalClass;
  			}
  		}
  		touchPositions = null; 
  		touchDirections = null;
  	}
  }, false);

}


