export const environment = {
  production: true,
  spotifyClientId: process.env['SPOTIFY_CLIENT_ID'],
  spotifyClientSecret: process.env['SPOTIFY_CLIENT_SECRET'],
  spotifyApi: 'https://api.spotify.com/v1',
  redirectUri: 'http://localhost:4200', //TODO: assign real URI
};
