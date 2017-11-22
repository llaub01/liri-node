// requires
var keys = require("./keys.js");
var Twitter = require("twitter");
var Omdb = require("omdb");
var Spotify = require("spotify");
var fs = require("fs");

// pull keys from keys file
var client = new Twitter(keys);

// pull from process.argv
var liriCommand = process.argv[2];
var title = process.argv[3];

// switch for command line arguments
switch (liriCommand) {
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		spotifyThisSong();
		break;
	case "movie-this":
		movieThis();
		break;
	case "do-what-it-says":
		doWhatItSays();
		break;
	default:
		console.log("*************************\nYou're doing it wrong... let me help.\n*************************\nTYPE:\n'liri my-tweets' to view your most recent tweets.\n'liri spotify-this-song <song name>' to get info about a song.\n'liri movie-this <movie name>' to get info about a movie.\n'liri do-what-it-says' to read instructions from the 'random.txt' file.\n*************************");
}

// show tweets
function myTweets() {
	// pull tweets from twitter
	client.get('statuses/user_timeline', { screen_name: 'll_bootcamping', count: 20 }, function(error, tweets, response) {
    	if (!error) {
    		//cycle through tweets and log 'em
			for (i = 0; i < tweets.length; i++)
				console.log(tweets[i].created_at);
				console.log(tweets[i].text);
    	}
    	else {
      		console.log(error);
    	}
	});
}

// search songs
function spotifyThisSong() {

}

// search movies
function movieThis() {
// 	var omdbUrl = "http://www.omdbapi.com/?s=" + title + "&type=movie&r=json&apikey=" + keys.omdbKey;

// 	//call omdb with npm app
// 	omdb.search(title, function(err, movies) {
// 	    if (err) {
// 	        return console.log(err);
// 	    }
	 
// 	    if (movies.length < 1) {
// 	        return console.log('No movies were found!');
// 	    }
// 	    else {
// 	    	console.log(movies);
// 	    }
// 	});
// };

// omdb api use
// 	$.ajax( {
//       	url: omdbUrl,
//       	method: "GET"
//      }).done(function(response) {
//       	console.log("**** MOVIE INFO ****\nTitle: " + response.Title + "\nYear: " + response.Year + "\nIMDB Rating: " + response.Ratings[0].Value + "\nRotten Tomatoes Rating: " + response.Ratings[1].Value + "\nCountry of production: " + response.Country + "\nLanguage: " + response.Language + "\nPlot: " + response.Plot + "\nActors: " + response.Actors)
// 	});
}


// read what the file says to do
function doWhatItSays() {

}