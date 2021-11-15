// const jwt = require('jsonwebtoken');
// const axios = require('axios');
// require("dotenv").config()
// // Admin API key goes here
// const key = process.env.GHOST_ADMIN_API_KEY

// // Split the key into ID and SECRET
// const [id, secret] = key.split(':');

// // Create the token (including decoding secret)
// const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
//     keyid: id,
//     algorithm: 'HS256',
//     expiresIn: '5m',
//     audience: `/v3/admin/`
// });

// // Make an authenticated request to create a post
// const url = 'https://oran.ghost.io/ghost/api/v3/admin/posts/';
// const headers = { Authorization: `Ghost ${token}` };
// const payload = { posts: [{ title: 'Hello World' }] };
// axios.post(url, payload, { headers })
//     .then(response => console.log(response))
//     .catch(error => console.error(error));
// The admin API client is the easiest way to use the API
const GhostAdminAPI = require('@tryghost/admin-api');
require("dotenv").config()
// Configure the client
const api = new GhostAdminAPI({
    url: 'https://oran.ghost.io',
    // Admin API key goes here
    key: process.env.GHOST_ADMIN_API_KEY,
    version: 'v3'
});

// Make an authenticated request
api.posts.add({title: 'Hello world'})
    .then(response => console.log(response))
    .catch(error => console.error(error));