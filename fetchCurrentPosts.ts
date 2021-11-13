
const fetchCurrentPosts = async(url: RequestInfo) => {
    try{
        return await fetch(url).then(x=>x.json() )
    }catch(e){
        console.warn(e)
    }
}

export default  fetchCurrentPosts;