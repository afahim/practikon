$(document).ready(function(){

	var selectedSegment = null;

	var allSegments = document.getElementsByClassName('segment'); 

	var i;
	for(i = 0; i < allSegments.length; i++)
	{
		var styleNumber = Math.round(Math.random() * 2);
		allSegments[i].className = allSegments[i].className + " style" + styleNumber;
	}

	$(document).click(function(event){
		var thisClass = $(event.target).attr('class');
		var thisID = $(event.target).attr('id');


		if (thisClass == undefined)
		{
			var newClassList = removeClassWith("problematic-", 
				selectedSegment.get(0).className);

			selectedSegment.get(0).className = newClassList;

			var optionsID = selectedSegment.next().attr('id');
			document.getElementById(optionsID).innerHTML = "";
			$("#" + optionsID).append("<ol class=\"option\"></ol>");
			$(".choices").each(function(){
				$("#" + optionsID).append($(this).html());
			});
			$(".scope-nav").hide();
			$('#scope-modal').slideUp(600);
			selectedSegment.removeClass("selected");
			selectedSegment.removeClass("selected-non-problematic");
			selectedSegment = null;
			scopeDismissed = true;
		}

		else if (thisClass.indexOf("non-problematic") !== -1)
		{
			selectedSegment = $(event.target);
			selectedSegment.addClass("selected-non-problematic");
			var segmentToUnselect = selectedSegment;
			selectedSegment = null;
			setTimeout(function(){
				segmentToUnselect.removeClass("selected-non-problematic");
			},700);
			
		}

		//This Code is called when "selectable" segment is clicked on the activity.
		//It clears up the currently existent content.
		//ToDo: Remove duplicate code
		else if (thisClass.indexOf("problematic") !== -1 && thisClass.indexOf("problematic-") === -1)
		{

			$(".choices").remove();
			var optionsID = $(event.target).next().attr('id');
			selectedSegment = $(event.target);
			selectedSegment.addClass("selected");
			var segmentClass = "";

			if (thisClass.indexOf("good") !== -1) {
				$(".segment").removeClass("poor-context");
				$(".segment").removeClass("okay-context");
				segmentClass = segmentClass + "-good"
			} 
			else if (thisClass.indexOf("okay") !== -1) {
				segmentClass = segmentClass + "-okay"
				$(".segment").removeClass("poor-context");
				$(".segment").addClass("okay-context");
			}
			else if (thisClass.indexOf("poor") !== -1) {
				segmentClass = segmentClass + "-poor"
				$(".segment").removeClass("okay-context");
				$(".segment").addClass("poor-context");
			}

			selectedSegment.addClass(segmentClass);

			$("." + segmentClass + " > .segment-delete").fadeOut(0);
			$("." + segmentClass + " > .segment-delete").fadeIn(0, function(){
				$('#scope-modal').slideDown(600);
				$(".scope-nav").show();
				$("#scope-modal").append("<div id=\"slider\" class=\"swipe no-slide\"></div>");
				$("#slider").append("<ol class=\"swipe-wrap choices no-slide\"></ol>");
				$("#" + optionsID + " div").each(function(){
					$(".choices").append($(this).clone());
				});
				window.mySwipe = Swipe(document.getElementById('slider'));
				scopeDismissed = false;
			});
			
		}

		//Replacing existing text with the choice that was clicked.
		//Making existing text one of the available choices for the segment
		else if (thisClass.indexOf("choice") !== -1)
		{
			var originalText = selectedSegment.html();
			var selectedChoice = $(event.target).html();
			var classToAdd = "";

			if (thisClass.indexOf("good") !== -1) {
				classToAdd = replaceClassWith(
					"problematic",
					selectedSegment.get(0).className,
					classToAdd + "-good"
					);
				$(".segment").removeClass("poor-context");
				$(".segment").removeClass("okay-context");
			} 
			else if (thisClass.indexOf("okay") !== -1) {
				classToAdd = replaceClassWith(
					"problematic",
					selectedSegment.get(0).className,
					classToAdd + "-okay"
					);
				$(".segment").removeClass("poor-context");
				$(".segment").addClass("okay-context");
			}
			else if (thisClass.indexOf("poor") !== -1) {
				classToAdd = replaceClassWith(
					"problematic",
					selectedSegment.get(0).className,
					classToAdd + "-poor"
					);
				$(".segment").removeClass("okay-context");
				$(".segment").addClass("poor-context");
			}

			var actualOptionType = getClassWith("-option", 
				selectedSegment.get(0).className);

			var choiceOptionType = getClassWith("-option", 
				$(event.target).get(0).className);

			$(event.target).fadeOut("slow", function(){
				$(this).html(originalText).hide();
				$(this).fadeIn("slow");

				selectedSegment.html(selectedChoice).hide();
				selectedSegment.css("opacity", "1");
				selectedSegment.show();

				$(event.target).get(0).className = removeClassWith(
					"-option",
					$(event.target).get(0).className) + actualOptionType;

				setTimeout(function(){
					selectedSegment.get(0).className = removeClassWith(
					"-option",
					classToAdd) + choiceOptionType + " problematic";
					}, 10);
			});


		}

		// Not dismissing scope mode if clicked on by the user
		// ToDo: Change global clicks to onClicks to avoid overhead of going through this list sequentially
		else if (thisClass.indexOf("no-slide") !== -1 || thisClass.indexOf("segment-delete") !== -1)
		{

		}

		//Dismissing scope modal - in case user clicks anywhere but selectable text
		else
		{	
			var newClassList = removeClassWith("problematic-", 
				selectedSegment.get(0).className);

			selectedSegment.get(0).className = newClassList;

			//$(".selected > .segment-delete").fadeOut(20);
			var optionsID = selectedSegment.next().attr('id');
			document.getElementById(optionsID).innerHTML = "";
			$("#" + optionsID).append("<ol class=\"option\"></ol>");
			$(".choices").each(function(){
				$("#" + optionsID).append($(this).html());
			});
			$(".scope-nav").hide();
			$('#scope-modal').slideUp(600);
			selectedSegment.removeClass("selected");
			selectedSegment.removeClass("selected-non-problematic");
			selectedSegment = null;
			scopeDismissed = true;
		}
	});

});


function swipeLeft(){
	window.mySwipe.prev();
}

function swipeRight(){
	window.mySwipe.next();
}

function deleteSegment(event){
	var originalText = $( ".selected" ).html();
	$(".selected").html("...")
	$(".swipe-wrap > .empty-char").html(originalText);
}

