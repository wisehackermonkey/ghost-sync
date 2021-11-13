const fetchCurrentPosts = async(url: RequestInfo) => {return await (await fetch(url)).json()}
export default  fetchCurrentPosts;