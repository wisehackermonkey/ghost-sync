import { App, Notice } from 'obsidian';

let TurndownService = require('turndown')
let fs = require("fs")
const fetch = (...args: any[]) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

let turndownService = new TurndownService()
require('dotenv').config()

const DEFAULT_PAGE_LIMIT = 20
const fetchJson = async (url) => {
    try {
        return await fetch(url).then(x => x.json())
    } catch (e) {
        if (e.name === "FetchError") {
            console.log(`The your url you provided is invalid or that server is down \nthe url you used was:\n-----\n ${url}\n-----`)
            return "error"
        }

        console.warn(e)
    }
}
// const pipe = (firstValue, ...fns) => [...fns].reduce((v, fn) => fn(v), firstValue)

const pipe = (firstValue, ...fns) => [...fns].reduce((v, fn) => {

    if (Array.isArray(fn)) {
        if (fn.length >= 2) {
            return fn[0](v, fn[1])
        }
    }
    return fn(v)
}

    , firstValue)

const pipeAwait = async (firstValue, ...fns) => [...fns].reduce(async (v, fn) => await fn(v), firstValue)


const jsonStringify = (x) => JSON.stringify(x);
const convert_html_to_markdown = (text) => turndownService.turndown(text);
const extract_posts_object = (json) => json.posts;
const print = (text) => { console.log(text.toString()); return text; }
const printJSON = (text) => { console.log(JSON.stringify(text, null, 2)); return text; }
const convert_markdowns = (x) => x.map((v) => { v.html = convert_html_to_markdown(v.html); return v })
const formate_file_name = (x) => x.map((v) => { v.title = v.title.toLowerCase().replaceAll(/([^a-zA-Z])/g, " ").replaceAll(/([\s]{2,10})/g, " ").replaceAll(" ", "_"); return v; })
const write_files_to_disk = (x) => x.map((file, i) => {
    fs.writeFileSync(`./temp/${file.title}.md`, file.html)
})
const notifyer = (x) => { new Notice(JSON.stringify(x) || "notifyer"); return x }
// example https://demo.ghost.io/ghost/api/v3/content/posts?key=22444f78447824223cefc48062&fields=id,title,url,feature_image,created_at,custom_excerpt,html&limit=50&=page=0
const format_url = (blog_url, api_key, start_page = 0, limit = DEFAULT_PAGE_LIMIT) => (`${blog_url}/ghost/api/v3/content/posts?key=${api_key}&fields=id,title,url,feature_image,created_at,custom_excerpt,html&page=${start_page}&limit=${limit}`)

const page = async (prev_post, options) => {
    try {

        if (prev_post === null || prev_post === undefined || prev_post === false) {
            return false
        }
        console.log(prev_post.meta)
        let nextPageNumber = prev_post.meta.pagination.next
        if (nextPageNumber === 2 && prev_post.meta.pagination.page === 1) {
            nextPageNumber = 1
        }

        

        let url = format_url(options.baseUrl, options.ghostAdminghostAdminApiKey, nextPageNumber, DEFAULT_PAGE_LIMIT)
        new Notice(url);
        console.log(url);


        let postsJson = await fetchJson(url);
        if (postsJson.posts === null || postsJson.posts === undefined || postsJson.posts === false) {
            return false
        }
        // postsJson.meta.pagination.next  =    prev_post.meta.pagination.next
        // postsJson.meta.pagination.page  =    prev_post.meta.pagination.page
        postsJson.posts = [...postsJson.posts, ...prev_post.posts]
        // console.log(postsJson)
        return await postsJson

    } catch (e) {
        console.warn(e)
    }
}
const pagenage = async (options: {ghostAdminApiKey: string; baseUrl: string; }) => {
    let current_page = {
        "posts": [
        ],
        "meta": {
            "pagination": {
                "page": 1,
                "next": 2
            }
        }
    }
    while (current_page.meta.pagination.next !== null) {
        current_page = await page(current_page, options)
    }
    return current_page
}
let saveNotes = async (x: object, app: App) => {
    console.log(x)
    x.map((file, i: number) => {
        notifyer(file.title)
        app.vault.createFolder("./temp/")
        app.vault.create(`./temp/${file.title}.md`, file.html)
    })

}
const SynService = async (app: App,ghostAdminApiKey: string, baseUrl: string) => {
    // new Notice(__dirname);
    let options = {
        "ghostAdminApiKey":ghostAdminApiKey || process.env.GHOST_CONTENT_API_KEY,
        "baseUrl": baseUrl,
        "app": app
    }
    let jsonPosts = await pagenage(options)
    // notifyer(jsonPosts)
    let result = pipe(jsonPosts, extract_posts_object, convert_markdowns, formate_file_name, [saveNotes, app]);

}

// SynService()
export default SynService;