/* =========================================================================
  Practikon.js - Library for common functionalities performed by Practikon 
  activities.
  ========================================================================== */

/*---------------------------------------------------------------------------
    Miscellaneous operations for setting up activity
    -------------------------------------------------------------------------*/

var selectedSegment, thisClass, activityType, textDirection, selectedChoice;
var submitResponse, selectedChoiceIndex;

var responseSubmitted = false;
var setNumber;

var goodPoints, okayPoints, poorPoints;

var selectedChoiceIndex = 1;

$( document ).ready( function() {

    //Retrieving data from content file
    $( "#editable" ).load( "./" + $("#content-file").text() );

    //Finding out what type of activity we are dealing with
    activityType = $('meta[name=activity-type]').attr("content");

    //Processing all clicks according to type of element clicked
    $(document).click(processClick);

    populateScores();
    initActivitySwipe();

    document.onkeydown = processKeyPress; 
});

/*---------------------------------------------------------------------------
    Keyboard key-press handler
    -------------------------------------------------------------------------*/
function processKeyPress(event) {
    event = event || window.event;
    switch (event.keyCode) {
    case 13: //Enter key
        submitResponse();
        break;
    case 37: //Left Key
        if (!scopeDismissed) {
          window.mySwipe.prev();
        }
    break;
    case 39: //Right Key
        if (!scopeDismissed) {
          window.mySwipe.next();
        }
    break;
    }
};

/*---------------------------------------------------------------------------
    Checks previous user progress and populates page with scores accordingly
    -------------------------------------------------------------------------*/
function populateScores() {
    setNumber = $("#activity-set-number").text();

    goodPoints = localStorage.getItem(setNumber + "-good");
    okayPoints = localStorage.getItem(setNumber + "-okay");
    poorPoints = localStorage.getItem(setNumber + "-poor");

    if (goodPoints == undefined) {goodPoints = 0; localStorage.setItem(
        setNumber + "-good", "0");};
    if (okayPoints == undefined) {okayPoints = 0; localStorage.setItem(
        setNumber + "-okay", "0");};
    if (poorPoints == undefined) {poorPoints = 0; localStorage.setItem(
        setNumber + "-poor", "0");};

    $("#good-points").text(goodPoints);
    $("#okay-points").text(okayPoints);
    $("#poor-points").text(poorPoints);
}

/*---------------------------------------------------------------------------
    Initializes swipe functionality for activity, guide and context area
    -------------------------------------------------------------------------*/
function initActivitySwipe() {
    var transitioningFrom = 1;
    window.mySwipe2 = new Swipe(document.getElementById('slider2'), {
        startSlide: 1,
        continuous: false,
        transitionEnd: function(index, elem) {
            
            var swipeNumber = window.mySwipe2.getPos();

            if (swipeNumber == 0) {
		// context page visited
                $("#guide-button").removeClass("guide-active");
                //$("#context-button").addClass("context-active");
                $("#context-button").removeClass("context-active");
                $("#guide-button").fadeOut(150, function() {
                    $(this).text("back >").fadeIn(200);
                });
                $("#guide-button").addClass("back-active");
                transitioningFrom = 0;

		// data collection		
		var user_id = localStorage.getItem("login-id");
		saveEvent(user_id, "activity", setNumber, $("#content-file").text(), "context", "-", "-");
            }
            else if (swipeNumber == 2) {
		// guide page visited
                $("#context-button").removeClass("context-active");
                //$("#guide-button").addClass("guide-active");
                $("#guide-button").removeClass("guide-active");
                $("#context-button").fadeOut(150, function() {
                    $(this).text("< back").fadeIn(200);
                });
                $("#context-button").addClass("back-active");
                transitioningFrom = 2;

		// data collection
		var user_id = localStorage.getItem("login-id");
		saveEvent(user_id, "activity", setNumber, $("#content-file").text(), "guide", "-", "-");
            } 
            else {
		// back to the actiity page
                if (transitioningFrom === 2) {
                    $("#context-button").fadeOut(150, function() {
                        $(this).text("< context").fadeIn(200);
                    });
                }
                else if (transitioningFrom === 0) {
                    $("#guide-button").fadeOut(150, function() {
                        $(this).text("guide >").fadeIn(200);
                    });
                }
                $("#context-button").removeClass("back-active");
                $("#guide-button").removeClass("back-active");

		// data collection		
		var user_id = localStorage.getItem("login-id");
		saveEvent(user_id, "activity", setNumber, $("#content-file").text(), "back to activity", "-", "-");
            }
        }
    });
}

/*---------------------------------------------------------------------------
    Click handler for Practikon - calls different functions based on which
        area of the page was clicked
    -------------------------------------------------------------------------*/
function processClick(event) {
    thisClass = $(event.target).attr('class');
    var thisID = $(event.target).attr('id');

        // Not dismissing scope mode if useful functionality is clicked 
        // on by the user
        if (thisClass != undefined 
            && thisClass.indexOf("submit-answer") !== -1) {
            submitResponse();
    }
    else if (thisClass != undefined 
        && thisClass.indexOf("non-dismissing") !== -1) {
            //if this class isn't a scope modal navigation button
            /*if (thisClass.indexOf("scope-nav") === -1) {
                replaceChoice();
            }*/
        }
        
        else if (thisClass == undefined) {
            dismissScopeModal(event);
        }

        else if (thisClass.indexOf("non-problematic") !== -1) {
            animateNonProblematic(event);          
	    // data collection
	    var user_id = localStorage.getItem("login-id");
	    saveEvent(user_id, "activity", setNumber, $("#content-file").text(), "recognition", $(event.target).text(), "non-problematic");
        }

        //This Code is called when "selectable" segment is clicked.
        //It clears up the currently existent content.
        else if (thisClass.indexOf("problematic") !== -1 ) {
            processProblematic(event);  
	    // data collection
	    var user_id = localStorage.getItem("login-id");
	    saveEvent(user_id, "activity", setNumber, $("#content-file").text(), "recognition", $(event.target).text(), "problematic");
        }

        //Replacing existing text with the choice that was clicked.
        //Making existing text one of the available choices for the segment
        else if (thisClass.indexOf("choice") !== -1) {
            replaceChoice(event);
        }

        //Redirecting user to home page if clicked on home button
        else if (thisClass.indexOf("home-icon") !== -1) {
            window.location.replace("../../index.html");
        }

        //Dismissing scope modal - in case user clicks anywhere but selectable
        //text
        else {  
            dismissScopeModal(event);
        }
}


/*---------------------------------------------------------------------------
    Replacing chosen answer with currently selected answer in the activity
    -------------------------------------------------------------------------*/
function replaceChoice () {
    var originalText = selectedSegment.html();
    var selectedChoice = $("ol.choices div:eq(" + (selectedChoiceIndex-1) + ")");
    var selectedChoiceHTML = selectedChoice.html();

    var choiceClass = selectedChoice.attr('class');
    var classToAdd = "";

    if(typeof choiceClass === "undefined") {
	return;
    }

    if (textDirection) { //only for parallelism activity
        if (textDirection == 0) //text is displaced up
        {
            classToAdd = "problematic-up";
        } 
        else { //text is displaced down
            classToAdd = "problematic-down";
        }
    }

    if (choiceClass.indexOf("good") !== -1) {
        classToAdd = replaceClassWith(
	    "problematic",
	    selectedSegment.get(0).className,
	    classToAdd + "-good"
        );
    }
    else if (choiceClass.indexOf("okay") !== -1) {
        classToAdd = replaceClassWith(
	    "problematic",
	    selectedSegment.get(0).className,
	    classToAdd + "-okay"
        );
    }
    else if (choiceClass.indexOf("poor") !== -1) {
        classToAdd = replaceClassWith(
	    "problematic",
	    selectedSegment.get(0).className,
	    classToAdd + "-poor"
        );
    }

    var actualOptionType = getClassWith("-option", 
        selectedSegment.get(0).className);

    var choiceOptionType = getClassWith("-option", 
        selectedChoice.get(0).className);

    $("#scope-modal-message > span").css("visibility", 
        "visible");

    selectedSegment.html(selectedChoiceHTML).hide();
    selectedSegment.css("opacity", "1");
    selectedSegment.show(200);

    selectedChoice.get(0).className = removeClassWith(
            "-option",
            selectedChoice.get(0).className) + actualOptionType;

    selectedSegment.get(0).className = removeClassWith(
        "-option",
        classToAdd);

    setTimeout(function(){
        selectedSegment.get(0).className = removeClassWith(
            "-option",
            classToAdd) + choiceOptionType + " problematic";
    }, 0);
}

/*---------------------------------------------------------------------------
    Sliding down the scope modal window that shows answer choices
    -------------------------------------------------------------------------*/

function dismissScopeModal(event) {
    if (selectedSegment) {
        var newClassList = removeClassWith("problematic-", 
        selectedSegment.get(0).className);

        selectedSegment.get(0).className = newClassList;

        var optionsID = selectedSegment.attr('id');
        //document.getElementById(optionsID).innerHTML = "";
        /*$("#" + optionsID).append("<ol class=\"option\"></ol>");
        $(".choices").each(function(){
            $("#" + optionsID).append($(this).html());
        });*/
        $('#scope-modal').slideUp(600, function() {
            $(".scope-nav").hide();
        });
        selectedSegment.removeClass("selected");
        selectedSegment.removeClass("selected-non-problematic");
        selectedSegment = null;
        scopeDismissed = true;
    }
}

/*---------------------------------------------------------------------------
    Replacing chosen answer with corrently selected answer in the activity
    -------------------------------------------------------------------------*/

function animateNonProblematic(event) {
    selectedSegment = $(event.target);
    selectedSegment.addClass("selected-non-problematic");
    var segmentToUnselect = selectedSegment;
    selectedSegment = null;
    setTimeout(function(){
        segmentToUnselect.removeClass("selected-non-problematic");
    },700);
}

/*---------------------------------------------------------------------------
    Replacing chosen answer with corrently selected answer in the activity
    -------------------------------------------------------------------------*/
function processProblematic(event) {

    var segmentClass = "";
    var optionsID = $(event.target).attr('id');
    selectedSegment = $(event.target);

    if (activityType == "parallelism") {
        //textDirection randomly decides if problematic text moves 
        //up or down -> 1 is up, 0 is down
        if(textDirection == null) {
            textDirection = Math.round(Math.random());
        }

        if (textDirection == 0) {
            segmentClass = "problematic-up";
        } else {
            segmentClass = "problematic-down";
        }

        if (thisClass.indexOf("good") !== -1) {
            segmentClass = segmentClass + "-good"
        } else if (thisClass.indexOf("okay") !== -1) {
            segmentClass = segmentClass + "-okay"
        } else if (thisClass.indexOf("poor") !== -1) {
            segmentClass = segmentClass + "-poor"
        }

        selectedSegment.addClass(segmentClass);
    }

    selectedSegment.addClass("selected");

    $('#scope-modal').slideDown(600);
    $(".scope-nav").show();



    $(".choice").each(function(){
        $(".choices").append($(this).clone());
    });

    window.mySwipe = Swipe(document.getElementById('slider'), {
        continuous: true,
        transitionEnd: onModalSwipe
    });

    scopeDismissed = false;
}

function onModalSwipe(index, elem) {
    selectedChoiceIndex = index + 1;
    replaceChoice();
}

/*---------------------------------------------------------------------------
    Submits a response once an activity is completed
    -------------------------------------------------------------------------*/
function submitResponse() {
    if (!responseSubmitted){
	var user_id = localStorage.getItem("login-id");

        $("#scope-modal-message > span").html($("#next-activity").html());
        $(".problematic").addClass("submitted");
        $(".non-problematic").addClass("context-finalized");
        $(".scope-nav").hide();
        if ($(".problematic").hasClass("good-option")) {
            var goodPoints = parseInt(localStorage.getItem(setNumber 
                + "-good")) + 1;
            $("#good-points").text(goodPoints);
            localStorage.setItem(setNumber + "-good", goodPoints);
            $("#slider").html("<div class=\"choice no-slide swipe-wrap\">"
                + "Great job! You selected the most appropriate revision.");

	    // data collection
	    saveEvent(user_id, "activity", setNumber, $("#content-file").text(), "response", $(".problematic").text(), "good");
        }
        else {
            if( $(".problematic").hasClass("poor-option") ){
                var poorPoints = parseInt(localStorage.getItem(setNumber 
                    + "-poor")) + 1;
                $("#poor-points").text(poorPoints);
                localStorage.setItem(setNumber + "-poor", poorPoints);

		// data collection
                saveEvent(user_id, "activity", setNumber, $("#content-file").text(), "response", $(".problematic").text(), "poor");
            } 
            else if( $(".problematic").hasClass("okay-option")){
                var okayPoints = parseInt(localStorage.getItem(setNumber 
                    + "-okay")) + 1;
                $("#okay-points").text(okayPoints);
                localStorage.setItem(setNumber + "-okay", okayPoints);

		// data collection
                saveEvent(user_id, "activity", setNumber, $("#content-file").text(), "response", $(".problematic").text(), "okay");
            }

            $("#slider").html("<div class=\"choice no-slide swipe-wrap\">"
			      + "<div><div>Sorry. Your selection isn't the most appropriate revision.<br/>" 
			      + "Go to the guide page and find out more.</div>"
			      + "<div class=\"inline-guide-button\" onClick=\"window.mySwipe2.next();\">Guide</div></div>"
			      + "</div>"
			     );
/*
            $("#slider").html("<div class=\"choice no-slide swipe-wrap\">"
                + "here is a better response</br>" 
                + $(".choice.good-option").first().text() 
                + "</div>");
*/
        } 
    }
    responseSubmitted = true;
}


/*---------------------------------------------------------------------------
    Reset scores. This is used by the set_index.html file.
    -------------------------------------------------------------------------*/
function resetScores() {
    var setNumber = $("#activity-set-number").text();

    localStorage.setItem(setNumber + "-good", 0);
    localStorage.setItem(setNumber + "-okay", 0);
    localStorage.setItem(setNumber + "-poor", 0);

    var user_id = localStorage.getItem("login-id");
    saveEvent(user_id, "setIndex", setNumber, "-", "-", "-", "-");
}

