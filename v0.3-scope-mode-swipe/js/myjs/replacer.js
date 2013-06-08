$(document).ready(function(){

	var selectedSegment = null;

	$(document).click(function(event){
		var thisClass = $(event.target).attr('class');
		var thisID = $(event.target).attr('id');
		
		//This Code is called when "selectable" segment is clicked on the activity.
		//It clears up the currently existent content.
		if (thisClass === "segment")
		{
			$(".choices").remove();
			var optionsID = $(event.target).next().attr('id');
			$('#scope-modal').slideDown(600);
			$("#scope-modal").append("<div id=\"slider\" class=\"swipe\"></div>");
			$("#slider").append("<ol class=\"swipe-wrap choices\"></ol>");
			$("#" + optionsID + " div").each(function(){
				$(".choices").append($(this).clone());
			});
			selectedSegment = $(event.target);

			window.mySwipe = Swipe(document.getElementById('slider'));
		}

		//Replacing existing text with the choice that was clicked.
		//Making existing text one of the available choices for the segment
		else if (thisClass === "choice")
		{
			var originalText = selectedSegment.text();
			var selectedChoice = $(event.target).text();

			$(".segment").css("color", "grey");
			selectedSegment.css("color", "white");
			selectedSegment.fadeOut("slow", function(){
				$(this).text(selectedChoice).hide();
				$(this).css("color", "white");
				$(this).fadeIn(2500, function(){
					$(".segment").css("color", "white");
				});
			});

			$(event.target).fadeOut("slow", function(){
				$(this).text(originalText).hide();
				$(this).fadeIn("slow");
			});
		}

		//Not dismissing scope mode if clicked on by the user
		else if (thisID === "scope-modal" || thisClass === "choice")
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
			$('#scope-modal').slideUp(600);
			selectedSegment = null;
		}
	});

});