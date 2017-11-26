// requires files
var keys = require("./keys.js");

// requires npm packages
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var request = require("request");
var inquirer = require("inquirer-promise");

// global vars
var pickedMovie;
var pickedSong;
var songIterator;
var omdbMovieUrl
var doIt = [];
var doThis;

// pull keys from keys file / set new twitter connection
var client = new Twitter(keys);

// get spotify ready with id and secret

// pull cl args from process.argv
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
				console.log("\n*************************\n" + tweets[i].created_at + "\n" + tweets[i].text + "\n*************************");
				// console.log(tweets[i].text);
    	}
    	else {
      		console.log(error);
    	}
	});
}

// search songs
function spotifyThisSong() {
	var songOptions = [];
	var songContent = [];
	var songChoices = [];

	var spotify = new Spotify({
		id: "3af5d14e9dfa40899d89a6f444b16a97",
		secret: "9bcc87f0b53840eab5a0a32bdbf40538",
	});
	 
	spotify.search({ type: "track", query: title, limit: 10 }, function(err, data) {
		if (err) {
			return console.log("Error occurred: " + err);
		}

		songOptions = data.tracks.items;
		console.log(songOptions);

		if (songOptions.length > 1) {
			//save results to array for content display
			for (i = 0; i < songOptions.length; i++) {
				//save results to array for content display
				songContent[i] = { 
					artist: songOptions[i].artists[0].name,
					track: songOptions[i].name,
					album: songOptions[i].album.name,
					sampleUrl: songOptions[i].external_urls.spotify,
				}

				//save choices in readable array for inquiry
				songChoices[i] = i + " - " + songOptions[i].artists[0].name + " - " + songOptions[i].album.name;
				console.log(songChoices[i]);
			}

			//prompt for confirmation on which song
			inquirer.prompt([{
				type: "list",
				message: "Which song were you trying to find?",
				choices: songChoices,
				name: "pickedSong",
				default: songChoices[0],
			}]).then(function(results) {
				// get the reference for song data
				var tempSong = results.pickedSong.split(" - ");
				songIterator = tempSong[0];

				// display that song data
				console.log("***** SONG INFO *****\nArtist: " + songContent[songIterator].artist + "\nSong Title: " + songContent[songIterator].track + "\nAlbum: " + songContent[songIterator].album + "\nSample URL: " + songContent[songIterator].sampleUrl + "\n*********************");
			});
		}
	});

}

// search movies
function movieThis() {
 	var movieOptions = [];
 	var movieChoices = [];
 	var omdbSearchUrl = "http://www.omdbapi.com/?s=" + title + "&type=movie&r=json&apikey=7b861e19";

 	request(omdbSearchUrl, function(error, response, body){
		if (!error && response.statusCode == 200) {
			var tempMovie = JSON.parse(body);
			movieOptions = tempMovie.Search;

			if (movieOptions.length > 1) {
				//save result titles to array to prompt user
				for (i = 0; i < movieOptions.length; i++) {
					movieChoices[i] = movieOptions[i].Title + " - " + movieOptions[i].Year;
				}

				//prompt for confirmation on which movie
				inquirer.prompt([{
					type: "list",
					message: "Which movie were you trying to find?",
					choices: movieChoices,
					name: "pickedMovie",
					default: movieChoices[0],
				}]).then(function(results) {
					// get conf movie data from inquirer
					var finalMovie = results.pickedMovie.split(" - ");

					console.log(results);
					console.log(finalMovie);

					// movie data url
					omdbMovieUrl = "http://www.omdbapi.com/?t=" + finalMovie[0] + "&type=movie&y=" + finalMovie[1] + "&r=json&apikey=7b861e19";
					console.log(omdbMovieUrl);

					// get that movie data
					request(omdbMovieUrl, function(error, response, body){
						console.log(body.Ratings[0].Value);
						console.log(body.Ratings[1].Value);
						console.log("***** MOVIE INFO *****\nTitle: " + body.Title + "\nYear: " + body.Year + "\nIMDB Rating: " + body.Ratings[0].Value + "\nRotten Tomatoes Rating: " + body.Ratings[1].Value + "\nCountry of production: " + body.Country + "\nLanguage: " + body.Language + "\nPlot: " + body.Plot + "\nActors: " + body.Actors + "\n**********************")
					});
				});
	    	}
		}
		else {
			console.log(error);
		}
	});
}

// read what the file says to do
function doWhatItSays() {
	fs.readFile("./random.txt", 'utf8', function(err, data) {
		if (err) {
			console.log(err);
		}

		doIt = data.split(",");
		doThis = doIt[0];
		title = doIt[1];

			// what command we've read from file
		switch (doThis) {
			case "my-tweets":
				myTweets();
				break;
			case "spotify-this-song":
				spotifyThisSong();
				title = doIt[1];
				break;
			case "movie-this":
				movieThis();
				title = doIt[1];
				break;
			default:
				console.log("*************************\nYou're doing it wrong... let me help.\n*************************\nWithin the random.txt file, TYPE:\n'my-tweets' to view your most recent tweets.\n'spotify-this-song <song name>' to get info about a song.\n'movie-this <movie name>' to get info about a movie.\n'do-what-it-says' to read instructions from the 'random.txt' file.\n*************************");
		}
	});
}