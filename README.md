rucsi League Table
============
The project consists of one pages, and use the data to produce an animated league table for this season.
The data is provided in two `JavaScript` files. These files use the `JSONP` technique to provide you with a list of teams from the 2011/12 Premier League season (teams-jsonp.js), and all the results from that season (games-jsonp.js). 

It starts with an empty league table, where all teams are listed but no games have yet been played, and display a date of August 12th, 2011 (the day before the season starts). The date then increments one day at at time. As the date changes, the league table updates to include the results from the games played on that day. The animation finishes when the date reaches May 13th, 2012 (the last day of the season). 
When a team moves to a higher position in the table, they are highlighted in green. When a team moves to a lower position in the table, they are highlighted in red. It takes something like 60 seconds to run the animation for the whole season. 

Some things to note:

 * It does not use any `JavaScript` libraries (though `Bootstrap CSS` is used).
 * The solution works in any modern browser, but doesn't worry about making it fully cross browser or supporting older browsers.
 * The league table should always sorted by points first, then goal difference, then goals scored.
