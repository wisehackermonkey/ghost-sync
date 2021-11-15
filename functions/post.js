exports.handler = async function(event, context) {
    // your server-side functionality
    console.log("INFO: api works!")
    return {
        statusCode: 200,
        body: JSON.stringify({message: "INFO: api works!"})
    };
}