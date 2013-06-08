$(document).ready(function(){

	$("#activity-name").click(function(event){
			
	});

	var selectedSegment = null;

	$(document).click(function(event){
		var thisClass = $(event.target).attr('class');
		var thisID = $(event.target).attr('id');

		//alert(thisClass + ":" + thisID );
		
		//This Code is called when "selectable" segment is clicked on the activity.
		//It clears up the currently existent content.
		//ToDo: Remove duplicate code
		if (thisClass == undefined)
		{
			var optionsID = selectedSegment.next().attr('id');
			document.getElementById(optionsID).innerHTML = "";
			$("#" + optionsID).append("<ol class=\"option\"></ol>");
			$(".choices").each(function(){
				$("#" + optionsID).append($(this).html());
			});
			$(".scope-nav").hide();
			$('#scope-modal').slideUp(600);
			selectedSegment = null;
		}
		else if (thisClass === "segment")
		{
			$(".choices").remove();
			var optionsID = $(event.target).next().attr('id');
			$('#scope-modal').slideDown(600);
			$(".scope-nav").show();
			$("#scope-modal").append("<div id=\"slider\" class=\"swipe no-slide\"></div>");
			$("#slider").append("<ol class=\"swipe-wrap choices no-slide\"></ol>");
			$("#" + optionsID + " div").each(function(){
				$(".choices").append($(this).clone());
			});
			selectedSegment = $(event.target);
			window.mySwipe = Swipe(document.getElementById('slider'));
		}

		//Replacing existing text with the choice that was clicked.
		//Making existing text one of the available choices for the segment
		else if (thisClass.indexOf("choice") !== -1)
		{
			var originalText = selectedSegment.text();
			var selectedChoice = $(event.target).text();

			$(".segment").css("color", "grey");
			selectedSegment.css("color", "white");
			selectedSegment.fadeOut(200, function(){
				$(this).text(selectedChoice).hide();
				$(this).css("color", "white");
				$(this).show(0, function(){
					$( ".segment" ).animate({
						color: "#FFFFFF",
					}, 3000 );
				});
			});

			$(event.target).fadeOut("slow", function(){
				$(this).text(originalText).hide();
				$(this).fadeIn("slow");
			});
		}

		//Not dismissing scope mode if clicked on by the user
		// ToDo: Change global clicks to onClicks to avoid overhead of going through this list sequentially
		else if (thisClass.indexOf("no-slide") !== -1)
		{

		}

		//Dismissing scope modal - in case user clicks anywhere but selectable text
		else
		{	
			var optionsID = selectedSegment.next().attr('id');
			document.getElementById(optionsID).innerHTML = "";
			$("#" + optionsID).append("<ol class=\"option\"></ol>");
			$(".choices").each(function(){
				$("#" + optionsID).append($(this).html());
			});
			$(".scope-nav").hide();
			$('#scope-modal').slideUp(600);
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