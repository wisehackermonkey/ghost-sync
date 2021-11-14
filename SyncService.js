// import fetchCurrentPosts from "./fetchCurrentPosts.js"
let TurndownService = require('turndown')
let fs = require("fs")
let turndownService = new TurndownService()
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config()


const fetchCurrentPosts = async (url) => {
    try {
        return await fetch(url).then(x => x.json())
    } catch (e) {
        console.warn(e)
    }
}
const pipe = (firstValue, ...fns) =>  [...fns].reduce((v, fn) => fn(v), firstValue)

// grab url posts
const getGhostPosts = async (url) => {
    return await fetchCurrentPosts(url);
}
const jsonStringify = (x) => JSON.stringify(x);


const convert_html_to_markdown = (text) => turndownService.turndown(text);
const extract_posts_object = (json) => json.posts;
const print = (text) => { console.log(text.toString()); return text; }
const printJSON = (text) => { console.log(JSON.stringify(text, null, 2)); return text; }
const convert_markdowns = (x) => x.map((v) => { v.html = convert_html_to_markdown(v.html); return v })
const formate_file_name = (x) => x.map((v)=>{v.title =v.title.toLowerCase().replaceAll(/([^a-zA-Z])/g, " ").replaceAll(/([\s]{2,10})/g," ").replaceAll(" ","_"); return v;})
const write_files_to_disk = (x) => x.map((file, i) => {
    fs.writeFileSync(`../../../temp/${file.title}.md`, file.html)
})
const format_url = (blog_url, api_key,start_page=0,limit=50) => (`${blog_url}/ghost/api/v3/content/posts?key=${api_key}&fields=id,title,url,feature_image,created_at,custom_excerpt,html&page=${start_page}&limit=${limit}`)
// &limit=50&page=1
const pagenage = (n)=> {
    
}
const SynService = async (api_key) => {
    try {
        
        let URL  =  format_url("https://oran.ghost.io", api_key,0)//`https://oran.ghost.io/ghost/api/v3/content/posts?key=${api_key|process.env.GHOST_CONTENT_API_KEY}&fields=id,title,url,feature_image,created_at,custom_excerpt,html`
        // let URL = `https://demo.ghost.io/ghost/api/v3/content/posts?key=${"22444f78447824223cefc48062"}&fields=id,title,url,feature_image,created_at,custom_excerpt,html&limit=4`
        console.log(URL)
        let postsJson = await getGhostPosts(URL);

        pipe(postsJson,   extract_posts_object, printJSON,convert_markdowns,         formate_file_name,printJSON,write_files_to_disk)


    } catch (e) {
        console.warn(e)
    }
}

SynService(process.env.GHOST_CONTENT_API_KEY)
// export default  SynService;