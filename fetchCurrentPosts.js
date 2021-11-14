
const fetchCurrentPosts = async(url) => {
    try{
        return await fetch(url).then(x=>x.json() )
    }catch(e){
        console.warn(e)
    }
}

export default fetchCurrentPosts;