$(document).ready(function(){

	var selectedSegment = null;

	$(document).click(function(event){
		var thisClass = $(event.target).attr('class');
		var thisID = $(event.target).attr('id');

		//alert(thisClass + ":" + thisID );
		
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
			$('#scope-modal').slideDown(600);
			$(".scope-nav").show();
			$("#scope-modal").append("<div id=\"slider\" class=\"swipe no-slide\"></div>");
			$("#slider").append("<ol class=\"swipe-wrap choices no-slide\"></ol>");
			$("#" + optionsID + " div").each(function(){
				$(".choices").append($(this).clone());
			});
			selectedSegment = $(event.target);
			$(".segment").removeClass("selected");
			selectedSegment.addClass("selected");
			window.mySwipe = Swipe(document.getElementById('slider'));
		}

		//Replacing existing text with the choice that was clicked.
		//Making existing text one of the available choices for the segment
		//ToDo: We can get rid of jQuery UI and just rely on opacity to fade in out stuff without
		//having to change color to grey
		else if (thisClass.indexOf("choice") !== -1)
		{
			var originalText = selectedSegment.text();
			var selectedChoice = $(event.target).text();

			$(".segment, .non-actionable").css("color", "grey");
			$(".segment, .non-actionable").css("opacity", "0.3");
			selectedSegment.css("color", "white");
			selectedSegment.css("opacity", "1");
			selectedSegment.fadeOut(200, function(){
				$(this).text(selectedChoice).hide();
				$(this).css("color", "white");
				$(this).css("opacity", "1");
				$(this).show(0, function(){
					$( ".segment, .non-actionable" ).animate({
						color: "#FFFFFF",
						opacity: "1",
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