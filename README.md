# DeleteYoutubeHistory

Here's a script to selectively delete videos from your YouTube watch history
Discussion
Link to script

Has your YouTube feed gotten out of control with bad recommendations?

This script will enable you to programmatically delete videos from your YouTube watch history based on some filter you define.

Edit inside the try block of the "SHOULD_DELETE" function to return true or false based on your desired condition (by default it is configured to delete all videos less than 1:30 in length)

Paste the script into your console on this page: https://myactivity.google.com/activitycontrols/youtube\

Note: You must set ENABLED to true for the script to actually delete the videos. If not, they will just be logged to the console.

Tip: Run the script in disabled mode first to review which videos will be deleted and tune your filter before actually letting it delete stuff.
