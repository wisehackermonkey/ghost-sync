const GhostAdminAPI = require('@tryghost/admin-api');

exports.handler = async function (event, context) {
    console.log("Ghost Sync /api/v1/createpost.js:")
    let query = event.queryStringParameters
    let { baseUrl, ghostAdminApiKey, ghostContentApiKey, title, image, public, version } = event.queryStringParameters
    console.log(query.ghostAdminApiKey)
    // Configure the client
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };
    if (ghostAdminApiKey === undefined || ghostAdminApiKey === "") {
        return {
            statusCode: 401,
            headers: headers,
            body: JSON.stringify({ error: "missing ghostAdminApiKey" })
        };
    }
    if (ghostAdminApiKey.match(/^([a-f0-9]{24}:[a-f0-9]{64})/gm) === null) {
        return {
            statusCode: 401,
            headers: headers,
            body: JSON.stringify({ error: "ghostAdminApiKey: must follow format <24 characters>:<64 characters>" })
        };
    }
    if (title === undefined || title === "") {
        return {
            statusCode: 406,
            headers: headers,
            body: JSON.stringify({ error: "missing title <string>, example 'title': 'Ghost sync: the amazing obsidian app'" })
        }
    }

    if (baseUrl === undefined || baseUrl === "") {
        return {
            statusCode: 406,
            headers: headers,
            body: JSON.stringify({ error: "missing baseUrl <string>, example 'baseUrl': 'https://oransblog.com'" })
        }
    }
    const api = new GhostAdminAPI({
        url: baseUrl,
        // Admin API key goes here
        key: ghostAdminApiKey.trim(),
        version: 'v3'
    });

    let postData = {
        // "version": version,
        "title": title,
        // "url": "https://oran.ghost.io/ghost-sync-test-post/",
        // "public": Boolean(public),
        // "image": image
    }
    // // Make an authenticated request
    let results = await api.posts.add(postData)
    // console.log(results)

    let {
        id,
        _title,
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
        "id": id,
        "title": _title,
        "mobiledoc": mobiledoc,
        "feature_image": feature_image,
        "featured": featured,
        "status": status,
        "visibility": visibility,
        "created_at": created_at,
        "updated_at": updated_at,
    }
    console.log(response)

    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(response)
    };
}