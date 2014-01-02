/* =========================================================================
  Practikon.js - Library for common functionalities performed by Practikon 
  activities.
  ========================================================================== */

/*---------------------------------------------------------------------------
    Miscellaneous operations for setting up activity
    -------------------------------------------------------------------------*/
var selectedSegment, selectedChoice, thisClass, activityType, textDirection;
var submitResponse;

window.onload=function() {

    //Retrieving data from content file
    $( "#editable" ).load( "./" + $("#content-file").text() );

    activityType = $('meta[name=activity-type]').attr("content");

    //Processing all clicks according to type of element clicked
    $(document).click(function(event){

        thisClass = $(event.target).attr('class');
        var thisID = $(event.target).attr('id');
        
        console.log(thisClass);

        if (thisClass == undefined) {
            dismissScopeModal(event);
        }

        else if (thisClass.indexOf("non-problematic") !== -1) {
            animateNonProblematic(event);          
        }

        //This Code is called when "selectable" segment is clicked.
        //It clears up the currently existent content.
        else if (thisClass.indexOf("problematic") !== -1 
            && thisClass.indexOf("problematic-") === -1) {
            processSelectable(event);   
        }

        //Replacing existing text with the choice that was clicked.
        //Making existing text one of the available choices for the segment
        else if (thisClass.indexOf("choice") !== -1) {
            replaceChoice(event, thisClass);
        }

        // Not dismissing scope mode if useful functionality is clicked 
        // on by the user
        else if (thisClass.indexOf("no-slide") !== -1 
            || thisClass.indexOf("segment-delete") !== -1
            || thisClass.indexOf("response-submitter") !== -1 
            || thisClass.indexOf("activity-nav-button") !== -1) {
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
    });

/*---------------------------------------------------------------------------
    Swiping through context, guide and activity area
    -------------------------------------------------------------------------*/

        var responseSubmitted = false;
        var setNumber;

        setNumber = $("#activity-set-number").text();

        var goodPoints = localStorage.getItem(setNumber + "-good");
        var okayPoints = localStorage.getItem(setNumber + "-okay");
        var poorPoints = localStorage.getItem(setNumber + "-poor");

        if (goodPoints == undefined) {goodPoints = 0; localStorage.setItem(
            setNumber + "-good", "0");};
        if (okayPoints == undefined) {okayPoints = 0; localStorage.setItem(
            setNumber + "-okay", "0");};
        if (poorPoints == undefined) {poorPoints = 0; localStorage.setItem(
            setNumber + "-poor", "0");};

        $("#good-points").text(goodPoints);
        $("#okay-points").text(okayPoints);
        $("#poor-points").text(poorPoints);

        var transitioningFrom = 1;

        window.mySwipe2 = new Swipe(document.getElementById('slider2'), {
            startSlide: 1,
            transitionEnd: function(index, elem) {
                
                var swipeNumber = window.mySwipe2.getPos();

                if (swipeNumber == 0) {
                    $("#guide-button").removeClass("guide-active");
                    $("#context-button").addClass("context-active");
                    $("#guide-button").fadeOut(150, function() {
                        $(this).text("back >").fadeIn(200);
                    });
                    transitioningFrom = 0;
                }
                else if (swipeNumber == 2) {
                    $("#context-button").removeClass("context-active");
                    $("#guide-button").addClass("guide-active");
                    $("#context-button").fadeOut(150, function() {
                        $(this).text("< back").fadeIn(200);
                    });
                    transitioningFrom = 2;
                } 
                else {
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
                    $("#context-button").removeClass("context-active");
                    $("#guide-button").removeClass("guide-active");
                }
            }
        });

/*---------------------------------------------------------------------------
    Submitting a response once an activity is completed
    -------------------------------------------------------------------------*/

    submitResponse = function() {
        if (!responseSubmitted){
            $("#scope-modal-message > span").html($("#next-activity").html());
            $(".problematic").addClass("submitted");
            $(".non-problematic").addClass("context-finalized");
            $("#slider").html("<div class=\"choice no-slide swipe-wrap\">"
                + "best response:</br> " + $(".choice.good-option").text() 
                + "</div>");

            if( $(".problematic").hasClass("poor-option")){
                var poorPoints = parseInt(localStorage.getItem(setNumber 
                    + "-poor")) + 1;
                $("#poor-points").text(poorPoints);
                localStorage.setItem(setNumber + "-poor", poorPoints);
            } 
            else if( $(".problematic").hasClass("okay-option")){
                var okayPoints = parseInt(localStorage.getItem(setNumber 
                    + "-okay")) + 1;
                $("#okay-points").text(okayPoints);
                localStorage.setItem(setNumber + "-okay", okayPoints);
            }  else {
                var goodPoints = parseInt(localStorage.getItem(setNumber 
                    + "-good")) + 1;
                $("#good-points").text(goodPoints);
                localStorage.setItem(setNumber + "-good", goodPoints);
            }
        }
        responseSubmitted = true;
    }

/*---------------------------------------------------------------------------
    Programming keyboard keys to perform different functionalities
    -------------------------------------------------------------------------*/

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        switch (evt.keyCode) {
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
}

/*---------------------------------------------------------------------------
    Replacing chosen answer with corrently selected answer in the activity
    -------------------------------------------------------------------------*/

function replaceChoice (event, thisClass) {
        var originalText = selectedSegment.html();
        var selectedChoice = $(event.target).html();
        var classToAdd = "";

    if (textDirection) { //only for parallelism activity
        if (textDirection == 0) //text is displaced up
        {
            classToAdd = "problematic-up";
        } 
        else { //text is displaced down
            classToAdd = "problematic-down";
        }        
    }

    if (thisClass.indexOf("good") !== -1) {
        classToAdd = replaceClassWith(
            "problematic",
            selectedSegment.get(0).className,
            classToAdd + "-good"
            );
    } 
    else if (thisClass.indexOf("okay") !== -1) {
        classToAdd = replaceClassWith(
            "problematic",
            selectedSegment.get(0).className,
            classToAdd + "-okay"
            );
    }
    else if (thisClass.indexOf("poor") !== -1) {
        classToAdd = replaceClassWith(
            "problematic",
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
        $(this).fadeIn("slow", function(){
            $("#scope-modal-message > span").css("visibility", 
                "visible");
        });
        selectedSegment.html(selectedChoice).hide();
        selectedSegment.css("opacity", "1");
        selectedSegment.show();

        $(event.target).get(0).className = removeClassWith(
            "-option",
            $(event.target).get(0).className) + actualOptionType;

        selectedSegment.get(0).className = removeClassWith(
            "-option",
            classToAdd);

        setTimeout(function(){
            selectedSegment.get(0).className = removeClassWith(
                "-option",
                classToAdd) + choiceOptionType + " problematic";
        }, 0);
    });
}

/*---------------------------------------------------------------------------
    Sliding down the scope modal window that shows answer choices
    -------------------------------------------------------------------------*/

function dismissScopeModal(event) {
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

function processSelectable(event) {
    var segmentClass = "";
    var optionsID = $(event.target).next().attr('id');
    selectedSegment = $(event.target);

    if (activityType == "parallelism") {
        //textDirection randomly decides if problematic text moves 
        //up or down - 1 is up, 0 is down
        if(textDirection == null) {
            textDirection = Math.round(Math.random());
        }

        if (textDirection == 0) {
            segmentClass = "problematic-up";
        }
        else {
            segmentClass = "problematic-down";
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
    }

    $(".choices").remove();
    selectedSegment.addClass("selected");

    $("." + segmentClass + " > .segment-delete").fadeOut(0);
    $("." + segmentClass + " > .segment-delete").fadeIn(0, function(){
        $('#scope-modal').slideDown(600);
        $(".scope-nav").show();
        $("#scope-modal").append("<div id=\"slider\" "
            + "class=\"swipe no-slide\"></div>");
        $("#slider").append("<ol class=\"swipe-wrap choices "
            +"no-slide\"></ol>");
        $("#" + optionsID + " div").each(function(){
            $(".choices").append($(this).clone());
        });
        window.mySwipe = Swipe(document.getElementById('slider'));
        scopeDismissed = false;
    });
}