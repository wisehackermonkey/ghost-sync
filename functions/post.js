// const GhostAdminAPI = require('@tryghost/admin-api');
 
exports.handler = async function(event, context) {
    // your server-side functionality
    console.log("INFO: api works!")
    console.log(event)
    console.log(event.queryStringParameters)
    let query = event.queryStringParameters
    console.log(query.ghostAdminApiKey)
    // Configure the client
    // const api = new GhostAdminAPI({
    //     url: 'http://localhost:2368/',
    //     // Admin API key goes here
    //     key: 'YOUR_ADMIN_API_KEY',
    //     version: 'v3'
    // });
    
    // // Make an authenticated request
    // api.posts.add({title: 'Hello world'})
    //     .then(response => console.log(response))
    //     .catch(error => console.error(error));
    return {
        statusCode: 200,
        body: JSON.stringify({message: "INFO: api works!"})
    };
}