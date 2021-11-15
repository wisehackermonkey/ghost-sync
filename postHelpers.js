const postSchema = require("./api_schema.json")
const { v1 } = postSchema
const YAML = require('yamljs');


//pipe(first object, <function or >,[<fn>, <option data>])
//  this returns result of all functions running in a pipe
const pipe = (firstValue, ...fns) => [...fns].reduce((v, fn) => {

    if (Array.isArray(fn)) {
        if (fn.length >= 2) {
            return fn[0](v, fn[1])
        }
    }
    return fn(v)
}, firstValue)


const toYaml = (json) => YAML.stringify(json)
const printJson = (x) => { console.log(JSON.stringify(x, null, 2)); return x; }
const print = (x) => { console.log("-----"); console.log(x); return x; }
const extractSchemaHeader = (x) => {
    // https://regexr.com/69gsu
    // https://regexr.com/69gso
    return x.match(/^(\%\%)[^]+?(\%\%)$/gm)[0].replace(/((^\%\%)|(\%\%$))/gm, "").trim()
}
const parseHeaderSchema = (x) => YAML.parse(x)
const schemaParse = (x) => pipe(x,print,extractSchemaHeader,YAML.parse,print)
const schemaStringify = (x) => {
     
    return  `%%
${YAML.stringify(x)}%%`
}
// const extractSchema = (x)=> {}
// let example_object = {
//     "version": "1.0",
//     "title": "test",
//     "url": "",
//     "public": false,
//     "image": ""
// }
// let post = pipe(example_object, print, printJson, toYaml, print)

// pipe(
// `%%
// ${post}
// %%
// An American businessman took a vacation to a small coastal Mexican village on doctor’s orders. Unable to sleep after an urgent phone call from the office the first morning, he walked out to the pier to clear his head. A small boat with just one fisherman had docked, and inside the boat were several large yellowfin tuna. The American complimented the Mexican on the quality of his fish.

// “How long did it take you to catch them?” the American asked.

// “Only a little while,” the Mexican replied in surprisingly good English.

// “Why don’t you stay out longer a
// ### 
// %%post
// version:
// %%
// `, print,extractSchemaHeader,print,parseHeaderSchema,printJson);


// x,x,s,v,[[e,s,tr,s,SDF,],
//          [E,R,S,S,D]], G,FS,S,D,Q,S

export default {schemaParse,schemaStringify}

s  = `%%
version: '1.0'
title: Ghost Sync Test Post
url: https://oran.ghost.io/ghost-sync-test-post/
public: true
image: https://t3.ftcdn.net/jpg/02/92/15/64/360_F_292156404_ypLsZWQiPXfTsYiYF8FNqz58TXr4uhkj.jpg
%%

# dsafasdf
%%
a%%sddfds%%
dasdf
%%`
// pipe(s,print,extractSchemaHeader,parseHeaderSchema,print)