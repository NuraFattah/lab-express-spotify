require('dotenv').config();

const { request, response } = require('express');
const express = require('express');
const hbs = require('hbs');
//const axios = require('axios');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

console.log(process.env.SPOTIFY_CLIENT_ID);
console.log(process.env.SPOTIFY_CLIENT_SECRET);

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', (request, response) => {
  response.render('home');
});

app.get('/artist-search', (request, response) => {
  const artistName = request.query.query;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      const results = data.body.artists.items;
      console.log('The received data from the API: ', results);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      response.render('artist-search-results', {
        resultsFromApi: results
      });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  const term = request.query.term;
  axios
    .getArtistAlbums('')
    .then((result) => {
      response.render('results', {
        artist: result.data.Search
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
