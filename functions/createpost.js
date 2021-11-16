const GhostAdminAPI = require('@tryghost/admin-api');
 
exports.handler = async function(event, context) {
    console.log("Ghost Sync /api/v1/createpost.js:")
    let query = event.queryStringParameters
    let {baseUrl,ghostAdminApiKey,ghostContentApiKey,image,public,version} = event.queryStringParameters
    console.log(query.ghostAdminApiKey)
    // Configure the client
    const api = new GhostAdminAPI({
        url: baseUrl,
        // Admin API key goes here
        key: ghostAdminApiKey,
        version: 'v3'
    });
    
    let postData = {
        // "version": version,
        "title": query.title,
        // "url": "https://oran.ghost.io/ghost-sync-test-post/",
        // "public": Boolean(public),
        // "image": image
    }
    // // Make an authenticated request
    let results = await api.posts.add(postData)
    // console.log(results)

    let {
id, 
title, 
mobiledoc, 
feature_image, 
featured, 
status, 
visibility, 
created_at, 
updated_at
} = results

let response = {
    "version": "1.0",
    "id":id, 
    "title":title, 
    "mobiledoc":mobiledoc, 
    "feature_image":feature_image, 
    "featured":featured, 
    "status":status, 
    "visibility":visibility, 
    "created_at":created_at, 
    "updated_at":updated_at,
}
console.log(response)
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };
    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(response)
    };
}