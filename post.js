// const GhostAdminAPI = require('@tryghost/admin-api');

// Create a token without the client
const jwt = require('jsonwebtoken');
const axios = require('axios');

require("dotenv").config()
// Configure the client

const uploadPost = async (options) => {


    // Admin API key goes here
    const key = options.apiKey;

    // Split the key into ID and SECRET
    const [id, secret] = key.split(':');

    // Create the token (including decoding secret)
    const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
        keyid: id,
        algorithm: 'HS256',
        expiresIn: '5m',
        audience: `/v3/admin/`
    });


    // Make an authenticated request to create a post
    const url = options.url;
    const headers = {
        Authorization: `Ghost ${token}`,
        'Access-Control-Allow-Origin': '*',
    };
    const payload = { posts: [{ title: options.title }] };
    let result = await axios.post(url, payload, { headers })
    // .then(response => console.log(response))
    // .catch(error => console.error(error));
    console.log(result)
    return result


    // Make an authenticated request
    // const api = new GhostAdminAPI({
    //     url: options.url,
    //     // Admin API key goes here
    //     key: options.apiKey,
    //     version: 'v3'
    // });
    // // try{
    // let result = await api.posts.add({ title: options.title })
    // console.log(result)
    // return result
    // .then(response => console.log(response))
    // .catch(error => console.error(error));
    // }catch(e){
    //     console.log(e)
    // }

}

// uploadPost(
//     {
//         data: "wow it works",
//         url: 'https://oran.ghost.io/ghost/api/v3/admin/posts/',
//         title: "hello world",
//         apiKey: process.env.GHOST_ADMIN_API_KEY,
//     })



export default { uploadPost }