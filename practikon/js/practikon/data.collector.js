/* =========================================================================
  Data Collector - Parse based data collection library for Practikon
  (Under construction...)
  ========================================================================== */

// Initalize Parse
Parse.initialize("9DcG558i0QOsEKJgJYnjtCDHm6YAzcyMby3w2mC7", "yyiVotvybIqaiO3JH6sL95yLdrwBASltDe2xWg1y");

// Create a subclass of Parse.Object
var pEvent = Parse.Object.extend("pEvent");

/*---------------------------------------------------------------------------
    This function is used to save a user event.
    -------------------------------------------------------------------------*/
function initParse() {

    // save the home-page-visited event
    user_id = localStorage.getItem("login-id");
    saveEvent(user_id, "home", "-", "-", "-", "-", "-");
}

/*
  use_id:        student id
  page_type:     LOGIN, home, setIndex, or activity
  set_id:        set id
  activity_name  activity file name (HTML content file)
  event_type:    recognition, response, guide, or context
  response:      actual text selected by the user.
  choice:        good, okay, or poor
*/

function saveEvent(user_id, page_type, set_id, activity_name, event_type, response, choice)  {
    if(user_id == "non-participant")
	// don't record activities by non participants
	return;
    else {
	var pevent = new pEvent();

	pevent.save({
	    userId:          user_id,
	    pageType:        page_type,
	    setId:           set_id,
	    activityName:    activity_name,
	    eventType:       event_type,
	    response:        response,
	    choice:          choice,
	}, {
	    success: function(activity) {
		// The object was saved successfully.
	    },
	    error: function(activity, error) {
		// The save failed.
		// error is a Parse.Error with an error code and description.
	    }
	});
    }
}

