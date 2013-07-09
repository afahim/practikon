$(document).ready(function(){

	var selectedSegment = null;
	var textDirection = null;

	$(document).click(function(event){
		var thisClass = $(event.target).attr('class');
		var thisID = $(event.target).attr('id');

		//alert(thisClass + ":" + thisID );
		
		if (thisClass == undefined)
		{
			var newClassList = removeClassWith("selected-problematic", 
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
		else if (thisClass.indexOf("problematic") !== -1 && thisClass.indexOf("selected-problematic") === -1)
		{
			//textDirection randomly decides if problematic text moves up or down. 1 is up, 0 is down
			textDirection = Math.round(Math.random());

			$(".choices").remove();
			var optionsID = $(event.target).next().attr('id');
			selectedSegment = $(event.target);
			var segmentClass = "";

			if (textDirection == 0) {
				segmentClass = "selected-problematic-up";
			}
			else {
				segmentClass = "selected-problematic-down";
			}

			if (thisClass.indexOf("good") !== -1) {
				segmentClass = segmentClass + "-good"
			} 
			else if (thisClass.indexOf("okay") !== -1) {
				segmentClass = segmentClass + "-okay"
			}
			else if (thisClass.indexOf("poor") !== -1) {
				segmentClass = segmentClass + "-poor"
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
			var classToAdd = "";

			if (textDirection == 0) //text is displaced up
			{
				classToAdd = "selected-problematic-up";
			} else { //text is displaced down
				classToAdd = "selected-problematic-down";
			}

			if (thisClass.indexOf("good") !== -1) {
				classToAdd = replaceClassWith(
					"selected-problematic",
					selectedSegment.get(0).className,
					classToAdd + "-good"
					);
			} 
			else if (thisClass.indexOf("okay") !== -1) {
				classToAdd = replaceClassWith(
					"selected-problematic",
					selectedSegment.get(0).className,
					classToAdd + "-okay"
					);
			}
			else if (thisClass.indexOf("poor") !== -1) {
				classToAdd = replaceClassWith(
					"selected-problematic",
					selectedSegment.get(0).className,
					classToAdd + "-poor"
					);
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

				selectedSegment.get(0).className = removeClassWith(
					"-option",
					classToAdd) + choiceOptionType;
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
			var newClassList = removeClassWith("selected-problematic", 
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
		}
	});

});

//This function takes in a string and a className which can contain multiple classes
//It returns the class which contains all or part of the string
function getClassWith(string, className){
	var classList = className.split(/\s+/);
	for (var i = 0; i < classList.length; i++) 
	{
		if (classList[i].indexOf(string) !== -1)
		{
			return classList[i];
		}
	}

	return undefined;
}

//This function takes in a string and a className which can contain multiple classes
//It removes the class(es) which match the string
//It returns a modified class list as a string
function removeClassWith(string, className){
	var classList = className.split(/\s+/);
	var newClassList = "";
	for (var i = 0; i < classList.length; i++) 
	{
		if (classList[i].indexOf(string) === -1)
		{
			newClassList = newClassList + classList[i] + " ";
		}
	}
	return newClassList;
}

//This function takes in a string, a className which can contain multiple classes, and another string
//It removes the class(es) which match the string
//It adds the newString as a class to the className
//It returns a modified class list as a string
function replaceClassWith(string, className, newString){
	var classList = className.split(/\s+/);
	var newClassList = "";
	for (var i = 0; i < classList.length; i++) 
	{
		if (classList[i].indexOf(string) === -1)
		{
			newClassList = newClassList + classList[i] + " ";
		}
	}
	return newClassList + newString;
}


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

