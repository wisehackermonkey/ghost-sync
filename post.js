const GhostAdminAPI = require('@tryghost/admin-api');
require("dotenv").config()
// Configure the client

const createPost = async (options) => {
    // Make an authenticated request
    const api = new GhostAdminAPI({
        url: options.url,
        // Admin API key goes here
        key: options.apiKey,
        version: 'v3'
    });
    // try{
    let result = await api.posts.add({ title: options.title })
    console.log(result)
    return result
    // .then(response => console.log(response))
    // .catch(error => console.error(error));
    // }catch(e){
    //     console.log(e)
    // }

}

createPost(
    {
        data: "wow it works",
        url: 'https://oran.ghost.io',
        title: "hello world",
        apiKey: process.env.GHOST_ADMIN_API_KEY,
    })