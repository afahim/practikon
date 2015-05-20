# practikon

A mobile web framework for creating interactive technical writing activities. Practikon allows technical writing teachers to create interactive activities for their classroom. Practikon is implemented as a front end application with a [parse](www.parse.com) backend. It teaches skills like 
* Gapping
* Parallelism
* Coherence
* Elaboration
* Nominalization
* Correctness
etc.

# usage

Practikon presentes the students with a string of activities each testing one of the different skills mentioned above. It is highly interactive and the user can interact with any part of the text.
* The user first clicks on different segments of the text to identify where the problem lies. Visual feedback is given when the user clicks on something that isn't problematic.
* Once the user has correctly figured out the segment with an issue, it becomes highlighted, and the user is given instructions about how to interact with the problematic text. 
* Depending on the type of skill the user is learning, the activity will feature a combination of interactions like swiping through, erasing, flicking, or other interaction appropriate for improving the sentence in addition to reinforcing the skill inside the mind of the user.

# running practikon

Copy and paste any one of the desired version folders (prefixed with a `v`) into the `public` folder of a server. That's it!

# creating a new activity type

Developers can extend Practikon to create new activity types. Core code for the repo is available in the `practikon` repository, and extensions have been made to suit different activity types in the different version folders (as prefixed with `v`). I would suggest looking at some of the commits that add a new activity to see what files need to be created for a new activity.

