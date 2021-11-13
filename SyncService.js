let TurndownService = require('turndown')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let turndownService = new TurndownService()



const fetchCurrentPosts = async(url) => {
    try{
        return await fetch("https://demo.ghost.io/ghost/api/v3/content/posts/?key=22444f78447824223cefc48062").then(x=>x.json() )
    }catch(e){
        console.warn(e)
    }
}

const convert_html_to_markdown = (text) => turndownService.turndown(text)
const print = (text) => { console.log(text); return text; }

// https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
// https://www.freecodecamp.org/news/pipe-and-compose-in-javascript-5b04004ac937/
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

// pipe(convert_html_to_markdown)(example1)


SyncService = async(contentApiKey="") =>{
        console.log(await fetchCurrentPosts())
        // return fetchCurrentPosts()
    }

// export default SyncService = (contentApiKey="") =>{
//     console.log(fetchCurrentPosts())
//     // return fetchCurrentPosts()
// }

SyncService();